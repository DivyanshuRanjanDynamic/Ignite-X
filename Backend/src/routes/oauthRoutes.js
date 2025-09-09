import express from 'express';
import oauthController from '../controllers/oauthController.js';
import config from '../config/env.js';

const router = express.Router();

// Only enable OAuth routes if feature is enabled and OAuth credentials are configured
const isOAuthEnabled = config.features.oauthLogin && 
  config.oauth.google.clientId && 
  config.oauth.github.clientId;

if (!isOAuthEnabled) {
  // If OAuth is not configured, return helpful error messages
  router.all('/*', (req, res) => {
    return res.status(503).json({
      success: false,
      error: {
        code: 'OAUTH_DISABLED',
        message: 'OAuth login is not configured. Please contact administrator.'
      }
    });
  });
} else {
  /**
   * @route GET /api/v1/auth/oauth/google
   * @desc Redirect to Google OAuth
   * @access Public
   * @query userType - 'student' or 'admin'
   */
  router.get('/google', oauthController.googleAuth);

  /**
   * @route GET /api/v1/auth/oauth/google/callback
   * @desc Handle Google OAuth callback
   * @access Public
   */
  router.get('/google/callback', oauthController.googleCallback);

  /**
   * @route GET /api/v1/auth/oauth/github
   * @desc Redirect to GitHub OAuth
   * @access Public
   * @query userType - 'student' or 'admin'
   */
  router.get('/github', oauthController.githubAuth);

  /**
   * @route GET /api/v1/auth/oauth/github/callback
   * @desc Handle GitHub OAuth callback
   * @access Public
   */
  router.get('/github/callback', oauthController.githubCallback);
}

export default router;
