import express from 'express';
import internshipController from '../controllers/internshipController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import uploadService from '../services/uploadService.js';

const router = express.Router();

// Public routes
/**
 * @route GET /api/v1/internships
 * @desc Get all internships with filters and pagination
 * @access Public
 */
router.get('/', internshipController.getInternships);

/**
 * @route GET /api/v1/internships/categories
 * @desc Get internship categories
 * @access Public
 */
router.get('/categories', internshipController.getCategories);

/**
 * @route GET /api/v1/internships/stats
 * @desc Get internship statistics
 * @access Public
 */
router.get('/stats', internshipController.getStats);

/**
 * @route GET /api/v1/internships/search
 * @desc Search internships
 * @access Public
 */
router.get('/search', internshipController.searchInternships);

// Protected routes (require authentication) - Must come before /:id to avoid conflicts
/**
 * @route GET /api/v1/internships/recommendations
 * @desc Get internship recommendations for student
 * @access Private (Student)
 */
router.get('/recommendations', authenticate, internshipController.getRecommendations);

/**
 * @route GET /api/v1/internships/saved
 * @desc Get saved internships for user
 * @access Private
 */
router.get('/saved', authenticate, internshipController.getSavedInternships);

/**
 * @route GET /api/v1/internships/:id
 * @desc Get single internship by ID
 * @access Public
 */
router.get('/:id', internshipController.getInternshipById);

/**
 * @route GET /api/v1/internships/:id/skills
 * @desc Get internship skills requirement
 * @access Public
 */
router.get('/:id/skills', internshipController.getInternshipSkills);

/**
 * @route POST /api/v1/internships/:id/save
 * @desc Save/bookmark an internship
 * @access Private
 */
router.post('/:id/save', authenticate, internshipController.saveInternship);

/**
 * @route DELETE /api/v1/internships/:id/save
 * @desc Unsave/unbookmark an internship
 * @access Private
 */
router.delete('/:id/save', authenticate, internshipController.unsaveInternship);

/**
 * @route POST /api/v1/internships/:id/apply
 * @desc Apply to an internship
 * @access Private (Student)
 */
router.post(
  '/:id/apply',
  authenticate,
  uploadService.getUploadMiddleware(),
  uploadService.handleUploadError,
  internshipController.applyToInternship
);

// Admin routes (require admin authentication)
/**
 * @route POST /api/v1/internships
 * @desc Create new internship
 * @access Private (Admin)
 */
router.post('/', authenticate, requireAdmin, internshipController.createInternship);

/**
 * @route PUT /api/v1/internships/:id
 * @desc Update internship
 * @access Private (Admin)
 */
router.put('/:id', authenticate, requireAdmin, internshipController.updateInternship);

/**
 * @route DELETE /api/v1/internships/:id
 * @desc Delete internship
 * @access Private (Admin)
 */
router.delete('/:id', authenticate, requireAdmin, internshipController.deleteInternship);

/**
 * @route GET /api/v1/internships/:id/applications
 * @desc Get internship applications
 * @access Private (Admin)
 */
router.get('/:id/applications', authenticate, requireAdmin, internshipController.getInternshipApplications);

export default router;
