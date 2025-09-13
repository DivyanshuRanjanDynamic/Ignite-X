import express from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import userRoutes from './userRoutes.js';
import internshipRoutes from './internshipRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import mlStatusRoutes from './mlStatusRoutes.js';
import resumeRoutes from './resumeRoutes.js';
import requiredSkillsRoutes from './requiredSkillsRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API version info
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PM Internship Platform API v1',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    endpoints: {
      auth: '/api/v1/auth',
      admin: '/api/v1/admin',
      users: '/api/v1/users',
      internships: '/api/v1/internships',
      applications: '/api/v1/applications',
      notifications: '/api/v1/notifications',
      mlStatus: '/api/v1/ml-status',
      dashboard: '/api/v1/dashboard',
      resumes: '/api/v1/resumes',
      requiredSkills: '/api/v1/required-skills',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/internships', internshipRoutes);
router.use('/applications', applicationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/ml-status', mlStatusRoutes);

// V1 API routes (previously V2, now changed to match frontend)
router.use('/resumes', resumeRoutes);
router.use('/required-skills', requiredSkillsRoutes);

// Dashboard route (import function)
router.get('/dashboard', async (req, res, next) => {
  try {
    const { authenticate } = await import('../middleware/auth.js');
    const { default: userController } = await import('../controllers/userController.js');
    authenticate(req, res, () => userController.getDashboardData(req, res));
  } catch (error) {
    next(error);
  }
});

export default router;
