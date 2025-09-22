import logger from '../config/logger.js';

// Authorized admin emails - only these can access admin features
const AUTHORIZED_ADMIN_EMAILS = [
  'divyanshuchannel2@gmail.com',
  'singhmanvi5983@gmail.com', 
  'ashishalways45@gmail.com',
  'operations@pminternship.gov.in'
];

/**
 * Admin Authentication Middleware
 * Ensures only pre-authorized admin emails can access admin routes
 */
export const requireAdmin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      logger.warn('Admin route access attempt without authentication', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        route: req.originalUrl,
      });

      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Authentication required to access admin features.',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'ADMIN') {
      logger.warn('Admin route access attempt with non-admin role', {
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        ip: req.ip,
        route: req.originalUrl,
      });

      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Admin access required.',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // SECURITY: Check if admin email is in the authorized whitelist
    if (!AUTHORIZED_ADMIN_EMAILS.includes(req.user.email.toLowerCase())) {
      logger.warn('Admin route access attempt with unauthorized email - BLOCKED', {
        userId: req.user.id,
        email: req.user.email,
        role: req.user.role,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        route: req.originalUrl,
      });

      return res.status(403).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED_ADMIN_ACCESS',
          message: 'Access denied. Only pre-authorized system administrators can access admin features.',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check if admin account is active
    if (!req.user.isActive || req.user.status !== 'ACTIVE') {
      logger.warn('Admin route access attempt with inactive account', {
        userId: req.user.id,
        email: req.user.email,
        status: req.user.status,
        isActive: req.user.isActive,
        ip: req.ip,
        route: req.originalUrl,
      });

      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Admin account is inactive. Contact system administrator.',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Log successful admin access
    logger.info('Admin route access granted', {
      userId: req.user.id,
      email: req.user.email,
      route: req.originalUrl,
      ip: req.ip,
    });

    next();
  } catch (error) {
    logger.error('Admin middleware error', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      ip: req.ip,
      route: req.originalUrl,
    });

    return res.status(500).json({
      success: false,
      error: {
        code: 'ADMIN_MIDDLEWARE_ERROR',
        message: 'Internal server error during admin authentication.',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Check if email is authorized admin
 */
export const isAuthorizedAdmin = (email) => {
  return AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Get list of authorized admin emails (for seeding purposes)
 */
export const getAuthorizedAdminEmails = () => {
  return [...AUTHORIZED_ADMIN_EMAILS];
};
