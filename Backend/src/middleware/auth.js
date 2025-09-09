import jwtUtil from '../utils/jwt.js';
import database from '../config/database.js';
import logger from '../config/logger.js';

/**
 * Authentication Middleware - Verify JWT Token
 * This middleware verifies the JWT token and attaches user info to req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = jwtUtil.extractTokenFromHeader(authHeader);

    if (!token) {
      logger.warn('Authentication failed - No token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        url: req.originalUrl,
      });

      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN_PROVIDED',
          message: 'Access token is required',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwtUtil.verifyAccessToken(token);
    } catch (error) {
      logger.warn('Authentication failed - Invalid token', {
        error: error.message,
        ip: req.ip,
        tokenPreview: token.substring(0, 20) + '...',
      });

      let errorCode = 'INVALID_TOKEN';
      let errorMessage = 'Invalid access token';

      if (error.message === 'Token expired') {
        errorCode = 'TOKEN_EXPIRED';
        errorMessage = 'Access token has expired';
      }

      return res.status(401).json({
        success: false,
        error: {
          code: errorCode,
          message: errorMessage,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Get fresh user data from database
    const user = await database.prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      logger.warn('Authentication failed - User not found', {
        userId: decoded.userId,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User account not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      logger.warn('Authentication failed - User account inactive', {
        userId: user.id,
        status: user.status,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Your account has been deactivated',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check if user account is suspended or banned
    if (user.status === 'SUSPENDED' || user.status === 'BANNED') {
      logger.warn('Authentication failed - User account suspended/banned', {
        userId: user.id,
        status: user.status,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_RESTRICTED',
          message: `Your account has been ${user.status.toLowerCase()}`,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Attach user to request object (exclude sensitive information)
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      profile: user.profile,
      lastLoginAt: user.lastLoginAt,
    };

    // Update last login timestamp (async, don't wait)
    database.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    }).catch((error) => {
      logger.warn('Failed to update last login timestamp', {
        userId: user.id,
        error: error.message,
      });
    });

    logger.debug('User authenticated successfully', {
      userId: user.id,
      role: user.role,
      url: req.originalUrl,
    });

    next();
  } catch (error) {
    logger.error('Authentication middleware error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      url: req.originalUrl,
      ip: req.ip,
    });

    return res.status(500).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication failed due to server error',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Authorization Middleware - Check User Roles
 * This middleware checks if the authenticated user has the required role(s)
 */
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        logger.warn('Authorization failed - User not authenticated', {
          url: req.originalUrl,
          ip: req.ip,
        });

        return res.status(401).json({
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'You must be logged in to access this resource',
          },
          timestamp: new Date().toISOString(),
        });
      }

      // Convert single role to array for consistency
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Check if user's role is in allowed roles
      if (!rolesArray.includes(req.user.role)) {
        logger.warn('Authorization failed - Insufficient permissions', {
          userId: req.user.id,
          userRole: req.user.role,
          requiredRoles: rolesArray,
          url: req.originalUrl,
          ip: req.ip,
        });

        return res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: 'You do not have permission to access this resource',
            details: {
              required: rolesArray,
              current: req.user.role,
            },
          },
          timestamp: new Date().toISOString(),
        });
      }

      logger.debug('User authorized successfully', {
        userId: req.user.id,
        role: req.user.role,
        requiredRoles: rolesArray,
        url: req.originalUrl,
      });

      next();
    } catch (error) {
      logger.error('Authorization middleware error', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        userId: req.user?.id,
        url: req.originalUrl,
      });

      return res.status(500).json({
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Authorization failed due to server error',
        },
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Student Role Only Middleware
 * Only allows users with STUDENT role
 */
export const studentOnly = authorize(['STUDENT']);

/**
 * Admin Role Only Middleware  
 * Only allows users with ADMIN or SUPER_ADMIN role
 */
export const adminOnly = authorize(['ADMIN', 'SUPER_ADMIN']);

/**
 * Student or Admin Middleware
 * Allows both students and admins
 */
export const studentOrAdmin = authorize(['STUDENT', 'ADMIN', 'SUPER_ADMIN']);

/**
 * Verified Users Only Middleware
 * Only allows users who have verified their email
 */
export const verifiedOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'You must be logged in to access this resource',
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (!req.user.isVerified) {
      logger.warn('Access denied - Email not verified', {
        userId: req.user.id,
        email: req.user.email,
        url: req.originalUrl,
      });

      return res.status(403).json({
        success: false,
        error: {
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Please verify your email address to access this resource',
        },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  } catch (error) {
    logger.error('Email verification middleware error', {
      error: error.message,
      userId: req.user?.id,
    });

    return res.status(500).json({
      success: false,
      error: {
        code: 'VERIFICATION_CHECK_ERROR',
        message: 'Failed to verify email status',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Optional Authentication Middleware
 * Tries to authenticate but doesn't fail if no token provided
 * Useful for endpoints that work for both authenticated and anonymous users
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtUtil.extractTokenFromHeader(authHeader);

    // If no token provided, continue without authentication
    if (!token) {
      req.user = null;
      return next();
    }

    // Try to verify token
    try {
      const decoded = jwtUtil.verifyAccessToken(token);
      const user = await database.prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          profile: true,
        },
      });

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          profile: user.profile,
        };
      } else {
        req.user = null;
      }
    } catch (error) {
      // If token is invalid, continue without authentication
      req.user = null;
    }

    next();
  } catch (error) {
    logger.error('Optional authentication middleware error', {
      error: error.message,
      url: req.originalUrl,
    });

    // On error, continue without authentication
    req.user = null;
    next();
  }
};

/**
 * Role-Based Resource Access Control
 * Allows different levels of access based on user role and resource ownership
 */
export const resourceAccess = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'NOT_AUTHENTICATED',
            message: 'Authentication required',
          },
        });
      }

      const { user } = req;
      const resourceId = req.params.id;

      // Admins have access to everything
      if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
        return next();
      }

      // Students can only access their own resources
      if (user.role === 'STUDENT') {
        let hasAccess = false;

        switch (resourceType) {
          case 'profile':
            // Students can access their own profile
            hasAccess = resourceId === user.id;
            break;

          case 'application':
            // Check if application belongs to the student
            const application = await database.prisma.application.findUnique({
              where: { id: resourceId },
            });
            hasAccess = application && application.studentId === user.id;
            break;

          case 'internship':
            // Students can view all internships but can't modify them
            if (req.method === 'GET') {
              hasAccess = true;
            }
            break;

          default:
            hasAccess = false;
        }

        if (!hasAccess) {
          logger.warn('Resource access denied', {
            userId: user.id,
            role: user.role,
            resourceType,
            resourceId,
            method: req.method,
          });

          return res.status(403).json({
            success: false,
            error: {
              code: 'RESOURCE_ACCESS_DENIED',
              message: 'You can only access your own resources',
            },
          });
        }
      }

      next();
    } catch (error) {
      logger.error('Resource access control error', {
        error: error.message,
        userId: req.user?.id,
        resourceType,
      });

      return res.status(500).json({
        success: false,
        error: {
          code: 'ACCESS_CONTROL_ERROR',
          message: 'Failed to verify resource access',
        },
      });
    }
  };
};
