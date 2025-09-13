/**
 * Required Skills Routes
 * Skill recommendations and learning resources
 */

import express from 'express';
import requiredSkillsController from '../controllers/requiredSkillsController.js';
import featureFlagService from '../services/featureFlagService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply feature flag middleware to all routes
router.use(featureFlagService.middleware.bind(featureFlagService));

/**
 * @route GET /api/v1/required-skills
 * @desc Get required skills for user based on ATS analysis
 * @access Private
 */
router.get(
  '/',
  authenticate,
  requiredSkillsController.getRequiredSkills
);

/**
 * @route GET /api/v1/required-skills/progress
 * @desc Get skill learning progress over time
 * @access Private
 */
router.get(
  '/progress',
  authenticate,
  requiredSkillsController.getSkillProgress
);

/**
 * @route POST /api/v1/required-skills/extract-keywords
 * @desc Extract keywords from resume text or resume ID
 * @access Private
 */
router.post(
  '/extract-keywords',
  authenticate,
  requiredSkillsController.extractKeywords
);

export default router;
