import express from 'express';
import authRoutes from './authRoutes.js';

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
      users: '/api/v1/users',
      internships: '/api/v1/internships',
      applications: '/api/v1/applications',
    },
    timestamp: new Date().toISOString(),
  });
});

// Mount route modules
router.use('/auth', authRoutes);

// TODO: Add other route modules
// router.use('/users', userRoutes);
// router.use('/internships', internshipRoutes);
// router.use('/applications', applicationRoutes);

export default router;
