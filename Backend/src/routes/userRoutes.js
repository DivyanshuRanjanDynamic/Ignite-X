import express from 'express';
import userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import uploadService from '../services/uploadService.js';

const router = express.Router();

// Profile routes
/**
 * @route GET /api/v1/users/:id/profile
 * @desc Get user profile by ID
 * @access Private (Own profile or Admin)
 */
router.get('/:id/profile', authenticate, userController.getUserProfile);

/**
 * @route PUT /api/v1/users/:id/profile
 * @desc Update user profile
 * @access Private (Own profile only)
 */
router.put('/:id/profile', authenticate, userController.updateProfile);

/**
 * @route POST /api/v1/users/profile/picture
 * @desc Upload profile picture
 * @access Private
 */
router.post(
  '/profile/picture',
  authenticate,
  uploadService.getUploadMiddleware(),
  uploadService.handleUploadError,
  userController.uploadProfilePicture
);

/**
 * @route POST /api/v1/users/profile/resume
 * @desc Upload resume
 * @access Private
 */
router.post(
  '/profile/resume',
  authenticate,
  uploadService.getUploadMiddleware(),
  uploadService.handleUploadError,
  userController.uploadResume
);

// User settings and preferences
/**
 * @route PUT /api/v1/users/settings
 * @desc Update user settings
 * @access Private
 */
router.put('/settings', authenticate, userController.updateUserSettings);

/**
 * @route PUT /api/v1/users/preferences
 * @desc Update user preferences
 * @access Private
 */
router.put('/preferences', authenticate, userController.updateUserPreferences);

// User statistics and activity
/**
 * @route GET /api/v1/users/stats
 * @desc Get user statistics
 * @access Private
 */
router.get('/stats', authenticate, userController.getUserStats);

/**
 * @route GET /api/v1/users/activity
 * @desc Get user activity log
 * @access Private
 */
router.get('/activity', authenticate, userController.getUserActivity);


// Account management
/**
 * @route POST /api/v1/users/deactivate
 * @desc Deactivate account
 * @access Private
 */
router.post('/deactivate', authenticate, userController.deactivateAccount);

/**
 * @route DELETE /api/v1/users/account
 * @desc Delete account
 * @access Private
 */
router.delete('/account', authenticate, userController.deleteAccount);

// Admin routes
/**
 * @route GET /api/v1/users
 * @desc Get all users (admin only)
 * @access Private (Admin)
 */
router.get('/', authenticate, requireAdmin, userController.getAllUsers);

/**
 * @route PUT /api/v1/users/:id/status
 * @desc Update user status (admin only)
 * @access Private (Admin)
 */
router.put('/:id/status', authenticate, requireAdmin, userController.updateUserStatus);

/**
 * @route GET /api/v1/users/admin/stats
 * @desc Get user statistics for admin dashboard
 * @access Private (Admin)
 */
router.get('/admin/stats', authenticate, requireAdmin, userController.getAdminUserStats);

export default router;
