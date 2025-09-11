import { google } from 'googleapis';
import axios from 'axios';
import database from '../config/database.js';
import logger from '../config/logger.js';
import jwtUtil from '../utils/jwt.js';
import config from '../config/env.js';
import { isAuthorizedAdmin } from '../middleware/adminAuth.js';

class OAuthController {
  /**
   * Google OAuth - Redirect to Google
   * GET /api/v1/auth/oauth/google?userType=student
   */
  async googleAuth(req, res) {
    try {
      const { userType = 'student' } = req.query;
      
      if (!['student', 'admin'].includes(userType)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_TYPE',
            message: 'User type must be either student or admin'
          }
        });
      }

      const oauth2Client = new google.auth.OAuth2(
        config.oauth.google.clientId,
        config.oauth.google.clientSecret,
        `${req.protocol}://${req.get('host')}/api/v1/auth/oauth/google/callback`
      );

      const scopes = ['email', 'profile'];
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: userType, // Pass userType in state
      });

      res.redirect(authUrl);
    } catch (error) {
      logger.error('Google OAuth initiation error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'OAUTH_INIT_FAILED',
          message: 'Failed to initiate Google OAuth'
        }
      });
    }
  }

  /**
   * Google OAuth Callback
   * GET /api/v1/auth/oauth/google/callback
   */
  async googleCallback(req, res) {
    try {
      const { code, state: userType } = req.query;

      if (!code) {
        return oauthController.handleOAuthError(res, 'Authorization code missing');
      }

      const oauth2Client = new google.auth.OAuth2(
        config.oauth.google.clientId,
        config.oauth.google.clientSecret,
        `${req.protocol}://${req.get('host')}/api/v1/auth/oauth/google/callback`
      );

      // Exchange code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      // Get user info from Google
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: googleUser } = await oauth2.userinfo.get();

      // Check if user exists with this Google ID or email  
      const existingUser = await database.prisma.user.findFirst({
        where: {
          OR: [
            { googleId: googleUser.id },
            { email: googleUser.email }
          ]
        }
      });
      
      // Additional check for Google ID uniqueness (since we removed DB constraint)
      if (googleUser.id) {
        const existingGoogleUser = await database.prisma.user.findFirst({
          where: { 
            googleId: googleUser.id,
            id: { not: existingUser?.id } // Exclude current user if updating
          }
        });
        
        if (existingGoogleUser) {
          logger.warn('Google ID already associated with another account', {
            googleId: googleUser.id,
            email: googleUser.email,
            existingUserEmail: existingGoogleUser.email
          });
          return oauthController.handleOAuthError(res, 'This Google account is already linked to another user');
        }
      }

      if (!existingUser) {
        // User not registered - redirect to registration with message
        return res.redirect(
          `${config.frontend.baseUrl}/register?oauth_error=not_registered&email=${encodeURIComponent(googleUser.email)}&provider=google`
        );
      }

      // Check if user type matches
      const expectedRole = userType === 'admin' ? 'ADMIN' : 'STUDENT';
      if (existingUser.role !== expectedRole) {
        return res.redirect(
          `${config.frontend.baseUrl}/login?oauth_error=invalid_user_type&expected=${userType}&actual=${existingUser.role.toLowerCase()}`
        );
      }

      // SECURITY: For admin OAuth, check if email is in authorized whitelist
      if (userType === 'admin' && !isAuthorizedAdmin(existingUser.email)) {
        logger.warn('OAuth admin login attempt with unauthorized email - BLOCKED', {
          email: existingUser.email,
          provider: 'google',
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
        
        return res.redirect(
          `${config.frontend.baseUrl}/login?oauth_error=unauthorized_admin&message=${encodeURIComponent('Access denied. Only pre-authorized system administrators can access admin features.')}`
        );
      }

      // Update Google ID if not set
      if (!existingUser.googleId) {
        await database.prisma.user.update({
          where: { id: existingUser.id },
          data: { googleId: googleUser.id }
        });
      }

      // Update last login and first login tracking
      const updateData = { 
        lastLoginAt: new Date()
      };
      
      // Track first login status for tour system
      if (existingUser.isFirstLogin) {
        updateData.isFirstLogin = false;
      }
      
      await database.prisma.user.update({
        where: { id: existingUser.id },
        data: updateData
      });

      // Generate JWT tokens
      const tokenPair = jwtUtil.generateTokenPair(existingUser);

      // Save refresh token
      await database.prisma.refreshToken.create({
        data: {
          userId: existingUser.id,
          token: tokenPair.refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }
      });

      logger.info('Google OAuth login successful', {
        userId: existingUser.id,
        email: existingUser.email,
        provider: 'google'
      });

      // Redirect to frontend with tokens
      const redirectUrl = existingUser.role === 'ADMIN' ? '/admin' : '/student-dashboard';
      const wasFirstLogin = existingUser.isFirstLogin;
      
      res.redirect(
        `${config.frontend.baseUrl}/oauth-success?` +
        `access_token=${tokenPair.accessToken}&` +
        `refresh_token=${tokenPair.refreshToken}&` +
        `user_type=${userType}&` +
        `is_first_login=${wasFirstLogin}&` +
        `redirect_url=${encodeURIComponent(redirectUrl)}`
      );

    } catch (error) {
      logger.error('Google OAuth callback error', { error: error.message });
      oauthController.handleOAuthError(res, 'Google OAuth authentication failed');
    }
  }

  /**
   * GitHub OAuth - Redirect to GitHub
   * GET /api/v1/auth/oauth/github?userType=student
   */
  async githubAuth(req, res) {
    try {
      const { userType = 'student' } = req.query;
      
      if (!['student', 'admin'].includes(userType)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_USER_TYPE',
            message: 'User type must be either student or admin'
          }
        });
      }

      const githubAuthUrl = 'https://github.com/login/oauth/authorize?' +
        `client_id=${config.oauth.github.clientId}&` +
        `redirect_uri=${encodeURIComponent(`${req.protocol}://${req.get('host')}/api/v1/auth/oauth/github/callback`)}&` +
        `scope=user:email&` +
        `state=${userType}`;

      res.redirect(githubAuthUrl);
    } catch (error) {
      logger.error('GitHub OAuth initiation error', { error: error.message });
      res.status(500).json({
        success: false,
        error: {
          code: 'OAUTH_INIT_FAILED',
          message: 'Failed to initiate GitHub OAuth'
        }
      });
    }
  }

  /**
   * GitHub OAuth Callback
   * GET /api/v1/auth/oauth/github/callback
   */
  async githubCallback(req, res) {
    try {
      const { code, state: userType } = req.query;

      if (!code) {
        return oauthController.handleOAuthError(res, 'Authorization code missing');
      }

      // Exchange code for access token
      const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: config.oauth.github.clientId,
        client_secret: config.oauth.github.clientSecret,
        code: code,
      }, {
        headers: {
          'Accept': 'application/json'
        }
      });

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        return oauthController.handleOAuthError(res, 'Failed to get GitHub access token');
      }

      // Get user info from GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${access_token}`,
          'User-Agent': 'PM-Internship-Platform'
        }
      });

      // Get user's primary email
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `token ${access_token}`,
          'User-Agent': 'PM-Internship-Platform'
        }
      });

      const githubUser = userResponse.data;
      const primaryEmail = emailResponse.data.find(email => email.primary)?.email;

      if (!primaryEmail) {
        return oauthController.handleOAuthError(res, 'GitHub email not found');
      }

      // Check if user exists with this GitHub ID or email
      const existingUser = await database.prisma.user.findFirst({
        where: {
          OR: [
            { githubId: String(githubUser.id) },
            { email: primaryEmail }
          ]
        }
      });
      
      // Additional check for GitHub ID uniqueness (since we removed DB constraint)
      if (githubUser.id) {
        const existingGithubUser = await database.prisma.user.findFirst({
          where: { 
            githubId: String(githubUser.id),
            id: { not: existingUser?.id } // Exclude current user if updating
          }
        });
        
        if (existingGithubUser) {
          logger.warn('GitHub ID already associated with another account', {
            githubId: String(githubUser.id),
            email: primaryEmail,
            existingUserEmail: existingGithubUser.email
          });
          return oauthController.handleOAuthError(res, 'This GitHub account is already linked to another user');
        }
      }

      if (!existingUser) {
        // User not registered - redirect to registration with message
        return res.redirect(
          `${config.frontend.baseUrl}/register?oauth_error=not_registered&email=${encodeURIComponent(primaryEmail)}&provider=github`
        );
      }

      // Check if user type matches
      const expectedRole = userType === 'admin' ? 'ADMIN' : 'STUDENT';
      if (existingUser.role !== expectedRole) {
        return res.redirect(
          `${config.frontend.baseUrl}/login?oauth_error=invalid_user_type&expected=${userType}&actual=${existingUser.role.toLowerCase()}`
        );
      }

      // SECURITY: For admin OAuth, check if email is in authorized whitelist
      if (userType === 'admin' && !isAuthorizedAdmin(existingUser.email)) {
        logger.warn('OAuth admin login attempt with unauthorized email - BLOCKED', {
          email: existingUser.email,
          provider: 'github',
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
        
        return res.redirect(
          `${config.frontend.baseUrl}/login?oauth_error=unauthorized_admin&message=${encodeURIComponent('Access denied. Only pre-authorized system administrators can access admin features.')}`
        );
      }

      // Update GitHub ID if not set
      if (!existingUser.githubId) {
        await database.prisma.user.update({
          where: { id: existingUser.id },
          data: { githubId: String(githubUser.id) }
        });
      }

      // Update last login and first login tracking
      const updateData = { 
        lastLoginAt: new Date()
      };
      
      // Track first login status for tour system
      if (existingUser.isFirstLogin) {
        updateData.isFirstLogin = false;
      }
      
      await database.prisma.user.update({
        where: { id: existingUser.id },
        data: updateData
      });

      // Generate JWT tokens
      const tokenPair = jwtUtil.generateTokenPair(existingUser);

      // Save refresh token
      await database.prisma.refreshToken.create({
        data: {
          userId: existingUser.id,
          token: tokenPair.refreshToken,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }
      });

      logger.info('GitHub OAuth login successful', {
        userId: existingUser.id,
        email: existingUser.email,
        provider: 'github'
      });

      // Redirect to frontend with tokens
      const redirectUrl = existingUser.role === 'ADMIN' ? '/admin' : '/student-dashboard';
      const wasFirstLogin = existingUser.isFirstLogin;
      
      res.redirect(
        `${config.frontend.baseUrl}/oauth-success?` +
        `access_token=${tokenPair.accessToken}&` +
        `refresh_token=${tokenPair.refreshToken}&` +
        `user_type=${userType}&` +
        `is_first_login=${wasFirstLogin}&` +
        `redirect_url=${encodeURIComponent(redirectUrl)}`
      );

    } catch (error) {
      logger.error('GitHub OAuth callback error', { error: error.message });
      oauthController.handleOAuthError(res, 'GitHub OAuth authentication failed');
    }
  }

  /**
   * Handle OAuth errors by redirecting to login page with error message
   */
  handleOAuthError(res, message) {
    res.redirect(
      `${config.frontend.baseUrl}/login?oauth_error=auth_failed&message=${encodeURIComponent(message)}`
    );
  }
}

const oauthController = new OAuthController();
export default oauthController;
