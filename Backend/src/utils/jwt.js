import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import logger from '../config/logger.js';

class JWTUtil {
  /**
   * Generate Access Token (short-lived, 15 minutes)
   * @param {Object} payload - User data to include in token
   * @returns {string} JWT access token
   */
  generateAccessToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.id,
        email: payload.email,
        role: payload.role,
        status: payload.status,
        isVerified: payload.isVerified,
        tokenType: 'access',
      };

      const token = jwt.sign(tokenPayload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiry,
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      logger.debug('Access token generated', {
        userId: payload.id,
        role: payload.role,
        expiresIn: config.jwt.accessExpiry,
      });

      return token;
    } catch (error) {
      logger.error('Error generating access token', {
        error: error.message,
        userId: payload?.id,
      });
      throw new Error('Token generation failed');
    }
  }

  /**
   * Generate Refresh Token (long-lived, 30 days)
   * @param {Object} payload - User data to include in token
   * @returns {string} JWT refresh token
   */
  generateRefreshToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.id,
        email: payload.email,
        tokenType: 'refresh',
        // Don't include sensitive info in refresh tokens
      };

      const token = jwt.sign(tokenPayload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiry,
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      logger.debug('Refresh token generated', {
        userId: payload.id,
        expiresIn: config.jwt.refreshExpiry,
      });

      return token;
    } catch (error) {
      logger.error('Error generating refresh token', {
        error: error.message,
        userId: payload?.id,
      });
      throw new Error('Refresh token generation failed');
    }
  }

  /**
   * Generate Email Verification Token
   * @param {Object} payload - User data for email verification
   * @returns {string} JWT email verification token
   */
  generateEmailVerificationToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.id,
        email: payload.email,
        tokenType: 'email-verification',
      };

      const token = jwt.sign(tokenPayload, config.jwt.emailSecret, {
        expiresIn: config.jwt.emailExpiry,
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      logger.debug('Email verification token generated', {
        userId: payload.id,
        email: payload.email,
      });

      return token;
    } catch (error) {
      logger.error('Error generating email verification token', {
        error: error.message,
        userId: payload?.id,
      });
      throw new Error('Email verification token generation failed');
    }
  }

  /**
   * Generate Password Reset Token
   * @param {Object} payload - User data for password reset
   * @returns {string} JWT password reset token
   */
  generatePasswordResetToken(payload) {
    try {
      const tokenPayload = {
        userId: payload.id,
        email: payload.email,
        tokenType: 'password-reset',
      };

      const token = jwt.sign(tokenPayload, config.jwt.resetSecret, {
        expiresIn: config.jwt.resetExpiry,
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      logger.debug('Password reset token generated', {
        userId: payload.id,
        email: payload.email,
      });

      return token;
    } catch (error) {
      logger.error('Error generating password reset token', {
        error: error.message,
        userId: payload?.id,
      });
      throw new Error('Password reset token generation failed');
    }
  }

  /**
   * Verify Access Token
   * @param {string} token - JWT access token to verify
   * @returns {Object} Decoded token payload
   */
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.accessSecret, {
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      if (decoded.tokenType !== 'access') {
        throw new Error('Invalid token type');
      }

      logger.debug('Access token verified', {
        userId: decoded.userId,
        role: decoded.role,
      });

      return decoded;
    } catch (error) {
      logger.debug('Access token verification failed', {
        error: error.message,
        tokenPreview: token?.substring(0, 20) + '...',
      });

      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Verify Refresh Token
   * @param {string} token - JWT refresh token to verify
   * @returns {Object} Decoded token payload
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret, {
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      if (decoded.tokenType !== 'refresh') {
        throw new Error('Invalid token type');
      }

      logger.debug('Refresh token verified', {
        userId: decoded.userId,
      });

      return decoded;
    } catch (error) {
      logger.debug('Refresh token verification failed', {
        error: error.message,
      });

      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      } else {
        throw new Error('Refresh token verification failed');
      }
    }
  }

  /**
   * Verify Email Verification Token
   * @param {string} token - JWT email verification token to verify
   * @returns {Object} Decoded token payload
   */
  verifyEmailVerificationToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.emailSecret, {
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      if (decoded.tokenType !== 'email-verification') {
        throw new Error('Invalid token type');
      }

      logger.debug('Email verification token verified', {
        userId: decoded.userId,
        email: decoded.email,
      });

      return decoded;
    } catch (error) {
      logger.debug('Email verification token failed', {
        error: error.message,
      });

      if (error.name === 'TokenExpiredError') {
        throw new Error('Email verification token expired');
      } else {
        throw new Error('Invalid email verification token');
      }
    }
  }

  /**
   * Verify Password Reset Token
   * @param {string} token - JWT password reset token to verify
   * @returns {Object} Decoded token payload
   */
  verifyPasswordResetToken(token) {
    try {
      const decoded = jwt.verify(token, config.jwt.resetSecret, {
        issuer: 'pm-internship-platform',
        audience: 'pm-internship-users',
      });

      if (decoded.tokenType !== 'password-reset') {
        throw new Error('Invalid token type');
      }

      logger.debug('Password reset token verified', {
        userId: decoded.userId,
        email: decoded.email,
      });

      return decoded;
    } catch (error) {
      logger.debug('Password reset token verification failed', {
        error: error.message,
      });

      if (error.name === 'TokenExpiredError') {
        throw new Error('Password reset token expired');
      } else {
        throw new Error('Invalid password reset token');
      }
    }
  }

  /**
   * Extract token from Authorization header
   * @param {string} authHeader - Authorization header value
   * @returns {string|null} JWT token or null
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return null;
  }

  /**
   * Generate token pair (access + refresh)
   * @param {Object} user - User object
   * @returns {Object} Object containing access and refresh tokens
   */
  generateTokenPair(user) {
    try {
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      logger.info('Token pair generated successfully', {
        userId: user.id,
        role: user.role,
      });

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: config.jwt.accessExpiry,
      };
    } catch (error) {
      logger.error('Error generating token pair', {
        error: error.message,
        userId: user?.id,
      });
      throw new Error('Token pair generation failed');
    }
  }
}

// Export singleton instance
const jwtUtil = new JWTUtil();
export default jwtUtil;
