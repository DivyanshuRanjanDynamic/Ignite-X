/**
 * Resume V2 API Tests
 * Comprehensive test suite for resume management functionality
 */

import request from 'supertest';
import { app } from '../src/server.js';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

describe('Resume V2 API', () => {
  let authToken;
  let testUser;
  let testResume;

  beforeAll(async () => {
    // Create test user
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'STUDENT',
        isEmailVerified: true
      }
    });

    // Generate auth token
    authToken = jwt.sign(
      { userId: testUser.id, role: testUser.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.resume.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v2/resumes/upload', () => {
    it('should upload resume successfully', async () => {
      const response = await request(app)
        .post('/api/v2/resumes/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('fake pdf content'), 'test-resume.pdf')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('resumeId');
      expect(response.body.data).toHaveProperty('atsScore');
      expect(response.body.data).toHaveProperty('skillScores');

      testResume = response.body.data;
    });

    it('should reject unsupported file types', async () => {
      const response = await request(app)
        .post('/api/v2/resumes/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', Buffer.from('fake content'), 'test.txt')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNSUPPORTED_FILE_TYPE');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/v2/resumes/upload')
        .attach('file', Buffer.from('fake pdf content'), 'test-resume.pdf')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v2/resumes/:id/preview', () => {
    it('should return preview URL', async () => {
      const response = await request(app)
        .get(`/api/v2/resumes/${testResume.resumeId}/preview`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('previewUrl');
    });

    it('should return 404 for non-existent resume', async () => {
      const response = await request(app)
        .get('/api/v2/resumes/nonexistent/preview')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v2/resumes/:id/download', () => {
    it('should redirect to download URL', async () => {
      const response = await request(app)
        .get(`/api/v2/resumes/${testResume.resumeId}/download`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(302);

      expect(response.headers.location).toBeDefined();
    });

    it('should handle ATS template download', async () => {
      const response = await request(app)
        .get(`/api/v2/resumes/${testResume.resumeId}/download?type=ats_template`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(302);

      expect(response.headers.location).toBeDefined();
    });
  });

  describe('GET /api/v2/resumes/:id/analytics', () => {
    it('should return analytics data', async () => {
      const response = await request(app)
        .get(`/api/v2/resumes/${testResume.resumeId}/analytics`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('overallScore');
      expect(response.body.data).toHaveProperty('skillScores');
      expect(response.body.data).toHaveProperty('weakSkills');
    });
  });

  describe('POST /api/v2/resumes/:id/request_review', () => {
    it('should create review request', async () => {
      const response = await request(app)
        .post(`/api/v2/resumes/${testResume.resumeId}/request_review`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('reviewRequestId');
      expect(response.body.data.status).toBe('PENDING');
    });
  });
});

describe('Required Skills API', () => {
  let authToken;
  let testUser;

  beforeAll(async () => {
    // Create test user with resume
    testUser = await prisma.user.create({
      data: {
        email: 'skills-test@example.com',
        password: 'hashedpassword',
        role: 'STUDENT',
        isEmailVerified: true
      }
    });

    // Create test resume with weak skills
    await prisma.resume.create({
      data: {
        userId: testUser.id,
        filename: 'test-resume',
        originalName: 'test-resume.pdf',
        storageUrl: 'https://example.com/resume.pdf',
        mimeType: 'application/pdf',
        fileSize: 1024,
        atsScore: 75,
        skillScores: {
          'JavaScript': 60,
          'Python': 85,
          'SQL': 45
        },
        atsStatus: 'COMPLETED'
      }
    });

    authToken = jwt.sign(
      { userId: testUser.id, role: testUser.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.resume.deleteMany({
      where: { userId: testUser.id }
    });
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    await prisma.$disconnect();
  });

  describe('GET /api/v2/required-skills', () => {
    it('should return weak skills', async () => {
      const response = await request(app)
        .get('/api/v2/required-skills')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.skills).toHaveLength(2); // JavaScript and SQL
      
      const skills = response.body.data.skills;
      expect(skills.find(s => s.skill === 'JavaScript')).toBeDefined();
      expect(skills.find(s => s.skill === 'SQL')).toBeDefined();
      expect(skills.find(s => s.skill === 'Python')).toBeUndefined(); // Score > 90
    });

    it('should return empty array when no weak skills', async () => {
      // Update resume with high scores
      await prisma.resume.updateMany({
        where: { userId: testUser.id },
        data: {
          skillScores: {
            'JavaScript': 95,
            'Python': 98,
            'SQL': 92
          }
        }
      });

      const response = await request(app)
        .get('/api/v2/required-skills')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.skills).toHaveLength(0);
    });
  });
});

describe('Feature Flag Integration', () => {
  it('should return 404 when feature is disabled', async () => {
    // Temporarily disable feature flag
    process.env.FEATURE_RESUME_V2 = 'false';

    const response = await request(app)
      .post('/api/v2/resumes/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', Buffer.from('fake pdf content'), 'test-resume.pdf')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('FEATURE_DISABLED');

    // Re-enable feature flag
    process.env.FEATURE_RESUME_V2 = 'true';
  });
});
