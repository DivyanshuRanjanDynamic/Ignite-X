import express from 'express';
import authController from '../controllers/authController.js';
import uploadService from '../services/uploadService.js';
import oauthRoutes from './oauthRoutes.js';
import {
  validate,
  studentRegisterSchema,
  adminRegisterSchema,
  loginSchema,
  emailVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} from '../validators/authValidators.js';
import { authenticate } from '../middleware/auth.js';
import { normalizeStudentRegistration } from '../middleware/normalize.js';

const router = express.Router();

// OAuth routes
router.use('/oauth', oauthRoutes);

/**
 * @route POST /api/v1/auth/register/student
 * @desc Register a new student account (4-step form)
 * @access Public
 */
router.post(
  '/register/student',
  uploadService.getUploadMiddleware(),
  uploadService.handleUploadError,
  normalizeStudentRegistration,
  validate(studentRegisterSchema),
  authController.studentRegister
);

/**
 * @route POST /api/v1/auth/register/admin
 * @desc Register a new admin account
 * @access Public (with optional admin token verification)
 */
router.post(
  '/register/admin',
  validate(adminRegisterSchema),
  authController.adminRegister
);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user (student or admin)
 * @access Public
 */
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user
 * @access Private
 */
router.post(
  '/logout',
  authController.logout
);

/**
 * @route POST /api/v1/auth/refresh-token
 * @desc Refresh access token using refresh token
 * @access Public
 */
router.post(
  '/refresh-token',
  authController.refreshToken
);

/**
 * @route GET /api/v1/auth/me
 * @desc Get current authenticated user
 * @access Private
 */
router.get(
  '/me',
  authenticate,
  authController.getCurrentUser
);

/**
 * @route POST /api/v1/auth/verify-email
 * @desc Verify email address using token
 * @access Public
 */
router.post(
  '/verify-email',
  validate(emailVerificationSchema),
  authController.verifyEmail
);

/**
 * @route POST /api/v1/auth/resend-verification
 * @desc Resend email verification
 * @access Public
 */
router.post(
  '/resend-verification',
  validate(forgotPasswordSchema), // Uses same schema as forgot password (just email)
  authController.resendEmailVerification
);

/**
 * @route POST /api/v1/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

/**
 * @route POST /api/v1/auth/reset-password
 * @desc Reset password using token
 * @access Public
 */
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  authController.resetPassword
);

/**
 * @route POST /api/v1/auth/change-password
 * @desc Change password (authenticated user)
 * @access Private
 */
router.post(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

// Development helper (remove in production)
if (process.env.NODE_ENV === 'development') {
  router.post('/dev/verify-user', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, error: 'Email required' });
      
      const { default: database } = await import('../config/database.js');
      await database.prisma.user.updateMany({
        where: { email: email.toLowerCase() },
        data: { isVerified: true, status: 'ACTIVE', emailVerifiedAt: new Date() }
      });
      
      res.json({ success: true, message: `User ${email} verified for development` });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
}

// Legacy route support for backward compatibility
/**
 * @route POST /api/v1/auth/register
 * @desc Legacy register endpoint (redirects to student registration)
 * @access Public
 * @deprecated Use /register/student instead
 */
router.post(
  '/register',
  uploadService.getUploadMiddleware(),
  uploadService.handleUploadError,
  validate(studentRegisterSchema),
  authController.studentRegister
);

export default router;
