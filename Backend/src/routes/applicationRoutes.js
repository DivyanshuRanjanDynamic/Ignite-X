import express from 'express';
import applicationController from '../controllers/applicationController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';

const router = express.Router();

// Student routes
/**
 * @route GET /api/v1/applications/my-applications
 * @desc Get current user's applications
 * @access Private (Student)
 */
router.get('/my-applications', authenticate, applicationController.getMyApplications);

/**
 * @route GET /api/v1/applications/:id
 * @desc Get single application by ID
 * @access Private (Student - own applications only)
 */
router.get('/:id', authenticate, applicationController.getApplicationById);

/**
 * @route PATCH /api/v1/applications/:id/status
 * @desc Update application status (withdraw)
 * @access Private (Student - own applications only)
 */
router.patch('/:id/status', authenticate, applicationController.updateApplicationStatus);

// Admin routes
/**
 * @route GET /api/v1/applications
 * @desc Get all applications (admin only)
 * @access Private (Admin)
 */
router.get('/', authenticate, requireAdmin, applicationController.getAllApplications);

/**
 * @route PUT /api/v1/applications/:id/review
 * @desc Review application (admin only)
 * @access Private (Admin)
 */
router.put('/:id/review', authenticate, requireAdmin, applicationController.reviewApplication);

/**
 * @route GET /api/v1/applications/stats
 * @desc Get application statistics (admin only)
 * @access Private (Admin)
 */
router.get('/stats', authenticate, requireAdmin, applicationController.getApplicationStats);

export default router;
