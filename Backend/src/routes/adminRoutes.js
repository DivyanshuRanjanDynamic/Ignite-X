import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import adminController from '../controllers/adminController.js';
import internshipController from '../controllers/internshipController.js';

const router = express.Router();

// All admin routes require authentication + admin authorization
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route GET /api/v1/admin/dashboard
 * @desc Get admin dashboard data
 * @access Private (Admin only)
 */
router.get('/dashboard', adminController.getDashboard.bind(adminController));

/**
 * @route GET /api/v1/admin/users
 * @desc Get users list for admin management
 * @access Private (Admin only)
 */
router.get('/users', adminController.getUsers.bind(adminController));

/**
 * @route PATCH /api/v1/admin/users/:id/status
 * @desc Update user status (activate/deactivate)
 * @access Private (Admin only)
 */
router.patch('/users/:id/status', adminController.updateUserStatus.bind(adminController));

/**
 * @route GET /api/v1/admin/applications
 * @desc Get all applications for admin review
 * @access Private (Admin only)
 */
router.get('/applications', adminController.getApplications.bind(adminController));

/**
 * @route PATCH /api/v1/admin/applications/:id/status
 * @desc Update application status
 * @access Private (Admin only)
 */
router.patch('/applications/:id/status', adminController.updateApplicationStatus.bind(adminController));

/**
 * @route GET /api/v1/admin/analytics
 * @desc Get analytics data
 * @access Private (Admin only)
 */
router.get('/analytics', adminController.getAnalytics.bind(adminController));

/**
 * @route POST /api/v1/admin/internships
 * @desc Create new internship (Admin only)
 * @access Private (Admin only)
 */
router.post('/internships', internshipController.createInternship.bind(internshipController));

/**
 * @route PUT /api/v1/admin/internships/:id
 * @desc Update internship (Admin only)
 * @access Private (Admin only)
 */
router.put('/internships/:id', internshipController.updateInternship.bind(internshipController));

/**
 * @route DELETE /api/v1/admin/internships/:id
 * @desc Delete internship (Admin only)
 * @access Private (Admin only)
 */
router.delete('/internships/:id', internshipController.deleteInternship.bind(internshipController));

/**
 * @route GET /api/v1/admin/internships/:id/applications
 * @desc Get internship applications (Admin only)
 * @access Private (Admin only)
 */
router.get('/internships/:id/applications', internshipController.getInternshipApplications.bind(internshipController));

export default router;
