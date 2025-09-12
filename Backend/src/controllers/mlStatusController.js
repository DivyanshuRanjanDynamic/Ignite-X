import logger from '../config/logger.js';
import mlRecommendationService from '../services/mlRecommendationService.js';

/**
 * ML Service Status Controller
 * Provides endpoints to check ML service health and data flow
 */
class MLStatusController {
  
  /**
   * Get comprehensive ML service status
   */
  async getMLStatus(req, res) {
    try {
      const serviceStatus = await mlRecommendationService.getServiceStatus();
      
      // Test with sample data to verify ML pipeline
      const testCandidateData = {
        education: 'Bachelor in Computer Science from Test University',
        skills: ['Python', 'Machine Learning', 'Data Analysis'],
        interests: ['AI', 'Technology'],
        location: 'Mumbai',
        workPreference: 'Remote',
        minStipend: null,
        maxDuration: null
      };

      let testRecommendations = [];
      let testSuccess = false;
      
      if (serviceStatus.available) {
        try {
          // Use the same limit as the actual recommendations endpoint (4)
          testRecommendations = await mlRecommendationService.getRecommendations(testCandidateData, 4);
          testSuccess = testRecommendations.length > 0;
        } catch (testError) {
          logger.warn('ML service test failed', { error: testError.message });
        }
      }

      const response = {
        success: true,
        data: {
          service: serviceStatus,
          testResults: {
            success: testSuccess,
            recommendationsCount: testRecommendations.length,
            sampleRecommendation: testRecommendations[0] || null
          },
          dataFlow: {
            studentDataCollection: 'Active',
            dataProcessing: serviceStatus.available ? 'ML-Powered' : 'Fallback',
            recommendationEngine: serviceStatus.available ? 'AI/ML Model' : 'Curated Data'
          },
          lastChecked: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      logger.error('ML status check failed', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to check ML service status',
        details: error.message
      });
    }
  }

  /**
   * Test ML recommendations with specific user data
   */
  async testMLRecommendations(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 4 } = req.query;

      // Get user profile data
      const database = (await import('../config/database.js')).default;
      
      let userProfile = null;
      let education = null;

      try {
        userProfile = await database.prisma.profile.findUnique({
          where: { userId },
          select: {
            skills: true,
            interests: true,
            location: true,
            workPreference: true
          }
        });

        education = await database.prisma.education.findFirst({
          where: { profile: { userId } },
          select: {
            degree: true,
            fieldOfStudy: true,
            instituteName: true
          }
        });
      } catch (dbError) {
        logger.warn('Database query failed in ML test', { error: dbError.message });
      }

      // Prepare candidate data
      const candidateData = {
        education: education ? `${education.degree} in ${education.fieldOfStudy || 'General'} from ${education.instituteName}` : 'Bachelor in Computer Science',
        skills: userProfile?.skills || ['Python', 'JavaScript'],
        interests: userProfile?.interests || ['Technology'],
        location: userProfile?.location || 'Mumbai',
        workPreference: userProfile?.workPreference || 'Remote',
        minStipend: null,
        maxDuration: null
      };

      // Get ML recommendations
      const recommendations = await mlRecommendationService.getRecommendations(
        candidateData, 
        parseInt(limit)
      );

      const serviceStatus = await mlRecommendationService.getServiceStatus();

      res.json({
        success: true,
        data: {
          userId,
          candidateData,
          recommendations,
          mlServiceUsed: serviceStatus.available,
          recommendationsCount: recommendations.length,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('ML test failed', { error: error.message, userId: req.params.userId });
      res.status(500).json({
        success: false,
        error: 'Failed to test ML recommendations',
        details: error.message
      });
    }
  }

  /**
   * Get student data collection status
   */
  async getStudentDataStatus(req, res) {
    try {
      const { userId } = req.params;
      const database = (await import('../config/database.js')).default;

      let profileData = null;
      let educationData = null;
      let applicationData = null;

      try {
        profileData = await database.prisma.profile.findUnique({
          where: { userId },
          select: {
            skills: true,
            interests: true,
            location: true,
            workPreference: true,
            updatedAt: true
          }
        });

        educationData = await database.prisma.education.findFirst({
          where: { profile: { userId } },
          select: {
            degree: true,
            fieldOfStudy: true,
            instituteName: true,
            updatedAt: true
          }
        });

        applicationData = await database.prisma.application.findMany({
          where: { profile: { userId } },
          select: { id: true, status: true, createdAt: true }
        });

      } catch (dbError) {
        logger.warn('Database query failed in data status check', { error: dbError.message });
      }

      const dataCompleteness = {
        profile: profileData ? {
          hasSkills: (profileData.skills || []).length > 0,
          hasInterests: (profileData.interests || []).length > 0,
          hasLocation: !!profileData.location,
          hasWorkPreference: !!profileData.workPreference,
          lastUpdated: profileData.updatedAt
        } : null,
        education: educationData ? {
          hasDegree: !!educationData.degree,
          hasFieldOfStudy: !!educationData.fieldOfStudy,
          hasInstitute: !!educationData.instituteName,
          lastUpdated: educationData.updatedAt
        } : null,
        applications: {
          count: applicationData?.length || 0,
          lastApplication: applicationData?.[0]?.createdAt || null
        }
      };

      res.json({
        success: true,
        data: {
          userId,
          dataCompleteness,
          mlReadiness: {
            hasProfileData: !!profileData,
            hasEducationData: !!educationData,
            dataQuality: this.calculateDataQuality(dataCompleteness),
            readyForML: this.isReadyForML(dataCompleteness)
          },
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Student data status check failed', { error: error.message });
      res.status(500).json({
        success: false,
        error: 'Failed to check student data status',
        details: error.message
      });
    }
  }

  /**
   * Calculate data quality score
   */
  calculateDataQuality(dataCompleteness) {
    let score = 0;
    let totalChecks = 0;

    if (dataCompleteness.profile) {
      const profile = dataCompleteness.profile;
      if (profile.hasSkills) score++;
      if (profile.hasInterests) score++;
      if (profile.hasLocation) score++;
      if (profile.hasWorkPreference) score++;
      totalChecks += 4;
    }

    if (dataCompleteness.education) {
      const education = dataCompleteness.education;
      if (education.hasDegree) score++;
      if (education.hasFieldOfStudy) score++;
      if (education.hasInstitute) score++;
      totalChecks += 3;
    }

    return totalChecks > 0 ? Math.round((score / totalChecks) * 100) : 0;
  }

  /**
   * Check if student data is ready for ML processing
   */
  isReadyForML(dataCompleteness) {
    return dataCompleteness.profile && 
           dataCompleteness.education &&
           dataCompleteness.profile.hasSkills &&
           dataCompleteness.education.hasDegree;
  }
}

export default new MLStatusController();
