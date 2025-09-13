/**
 * Resume Routes V2
 * Enhanced resume management with ATS scoring
 */

import express from 'express';
import resumeController from '../controllers/resumeController.js';
import uploadService from '../services/uploadService.js';
import featureFlagService from '../services/featureFlagService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply feature flag middleware to all routes
router.use(featureFlagService.middleware.bind(featureFlagService));

/**
 * @route POST /api/v1/resumes/upload
 * @desc Upload resume with ATS scoring
 * @access Private
 */
router.post(
  '/upload',
  authenticate,
  uploadService.getSingleUploadMiddleware(),
  uploadService.handleUploadError,
  resumeController.uploadResume.bind(resumeController)
);

/**
 * @route GET /api/v1/resumes/:id/preview
 * @desc Get resume preview URL
 * @access Private
 */
router.get(
  '/:id/preview',
  authenticate,
  resumeController.getResumePreview.bind(resumeController)
);

/**
 * @route GET /api/v1/resumes/:id/download
 * @desc Download resume (original or ATS template)
 * @access Private
 */
router.get(
  '/:id/download',
  authenticate,
  resumeController.downloadResume.bind(resumeController)
);

/**
 * @route GET /api/v1/resumes/:id/analytics
 * @desc Get resume analytics and ATS scores
 * @access Private
 */
router.get(
  '/:id/analytics',
  authenticate,
  resumeController.getResumeAnalytics.bind(resumeController)
);

/**
 * @route POST /api/v1/resumes/:id/request_review
 * @desc Request professional review
 * @access Private
 */
router.post(
  '/:id/request_review',
  authenticate,
  resumeController.requestReview.bind(resumeController)
);

/**
 * @route GET /api/v1/resumes/compare
 * @desc Compare two resume versions
 * @access Private
 */
router.get(
  '/compare',
  authenticate,
  resumeController.compareResumes.bind(resumeController)
);

export default router;
