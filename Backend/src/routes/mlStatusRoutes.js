import express from 'express';
import mlStatusController from '../controllers/mlStatusController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ML Service Status Routes
router.get('/status', mlStatusController.getMLStatus);
router.get('/test/:userId', authenticate, mlStatusController.testMLRecommendations);
router.get('/student-data/:userId', authenticate, mlStatusController.getStudentDataStatus);

export default router;
