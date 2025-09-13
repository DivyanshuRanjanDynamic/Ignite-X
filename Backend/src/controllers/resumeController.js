/**
 * Resume Controller V2
 * Handles enhanced resume upload, ATS scoring, and management
 */

import database from '../config/database.js';
import logger from '../config/logger.js';
import { StorageAdapterFactory } from '../adapters/storageAdapter.js';
import { ATSAdapterFactory } from '../adapters/atsAdapter.js';
import textExtractionService from '../services/textExtractionService.js';
import youtubeService from '../services/youtubeService.js';
import featureFlagService from '../services/featureFlagService.js';

class ResumeController {
  constructor() {
    try {
      // Initialize storage adapter with proper error handling
      this.storageAdapter = StorageAdapterFactory.create({
        type: 'cloudinary',
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'demo_cloud',
        apiKey: process.env.CLOUDINARY_API_KEY || 'demo_key',
        apiSecret: process.env.CLOUDINARY_API_SECRET || 'demo_secret'
      });

      // Initialize ATS adapter
      this.atsAdapter = ATSAdapterFactory.create({
        type: process.env.ATS_ADAPTER_TYPE || 'rule-based',
        mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
        apiKey: process.env.ML_SERVICE_API_KEY || 'demo_ml_key'
      });

      logger.info('ResumeController initialized successfully', {
        storageType: 'cloudinary',
        atsType: process.env.ATS_ADAPTER_TYPE || 'rule-based'
      });
    } catch (error) {
      logger.error('Failed to initialize ResumeController', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Upload resume with ATS scoring
   * POST /api/v1/resumes/upload
   */
  async uploadResume(req, res) {
    try {
      // Check if storage adapter is properly initialized
      if (!this.storageAdapter) {
        logger.error('Storage adapter not initialized');
        return res.status(500).json({
          success: false,
          error: {
            code: 'STORAGE_ADAPTER_ERROR',
            message: 'Storage service not available'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          },
          timestamp: new Date().toISOString()
        });
      }

      const userId = req.user.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE_UPLOADED',
            message: 'No file uploaded'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Validate file type
      if (!textExtractionService.isSupported(file.mimetype, file.originalname)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'UNSUPPORTED_FILE_TYPE',
            message: `Unsupported file type. Supported formats: ${textExtractionService.getSupportedFormats().join(', ')}`
          },
          timestamp: new Date().toISOString()
        });
      }

      // Upload to storage
      const uploadResult = await this.storageAdapter.upload(
        file.buffer,
        file.originalname,
        {
          folder: 'resumes-v2',
          resourceType: 'auto',
          allowedFormats: ['pdf', 'doc', 'docx'],
          tags: ['resume-v2', 'ats-enabled']
        }
      );

      // Extract text for ATS analysis
      let extractedText = null;
      let atsResult = null;
      let atsStatus = 'PENDING';

      try {
        extractedText = await textExtractionService.extractText(
          file.buffer,
          file.mimetype,
          file.originalname
        );

        // Clean extracted text
        extractedText = textExtractionService.cleanText(extractedText);

        // Get user profile for ATS context
        const userProfile = await this.getUserProfile(userId);

        // Perform ATS scoring
        atsResult = await this.atsAdapter.score(extractedText, userProfile);
        atsStatus = 'COMPLETED';

        logger.info('ATS scoring completed', {
          userId,
          overallScore: atsResult.overallScore,
          skillCount: Object.keys(atsResult.skillScores).length
        });
      } catch (atsError) {
        logger.error('ATS scoring failed', {
          userId,
          error: atsError.message
        });
        atsStatus = 'ERROR';
        atsResult = {
          overallScore: null,
          skillScores: {},
          recommendations: ['ATS analysis failed. Please try again.']
        };
      }

      // Save resume to database
      const resume = await database.prisma.resume.create({
        data: {
          userId,
          filename: uploadResult.publicId,
          originalName: file.originalname,
          storageUrl: uploadResult.url,
          previewUrl: this.storageAdapter.generatePreviewUrl(uploadResult.publicId),
          publicId: uploadResult.publicId,
          mimeType: file.mimetype,
          fileSize: file.size,
          atsScore: atsResult.overallScore,
          skillScores: atsResult.skillScores,
          extractedText,
          atsStatus,
          metadata: {
            uploadResult,
            atsResult,
            featureFlag: 'resume_v2'
          }
        }
      });

      logger.info('Resume uploaded successfully', {
        resumeId: resume.id,
        userId,
        filename: file.originalname,
        atsScore: atsResult.overallScore
      });

      res.json({
        success: true,
        data: {
          resumeId: resume.id,
          url: uploadResult.url,
          previewUrl: resume.previewUrl,
          atsScore: atsResult.overallScore,
          skillScores: atsResult.skillScores,
          recommendations: atsResult.recommendations,
          atsStatus
        },
        message: 'Resume uploaded and analyzed successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Resume upload failed', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload resume'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get resume preview URL
   * GET /api/v1/resumes/:id/preview
   */
  async getResumePreview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      // Find resume
      const resume = await database.prisma.resume.findFirst({
        where: {
          id,
          userId,
          isActive: true
        }
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESUME_NOT_FOUND',
            message: 'Resume not found'
          }
        });
      }

      // Generate preview URL if not exists
      let previewUrl = resume.previewUrl;
      if (!previewUrl && resume.publicId) {
        previewUrl = this.storageAdapter.generatePreviewUrl(resume.publicId);
        
        // Update resume with preview URL
        await database.prisma.resume.update({
          where: { id },
          data: { previewUrl }
        });
      }

      res.json({
        success: true,
        data: {
          resumeId: resume.id,
          previewUrl: previewUrl || resume.storageUrl,
          filename: resume.originalName,
          mimeType: resume.mimeType
        }
      });

    } catch (error) {
      logger.error('Resume preview failed', {
        error: error.message,
        resumeId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'PREVIEW_FAILED',
          message: 'Failed to generate preview'
        }
      });
    }
  }

  /**
   * Download resume (original or ATS template)
   * GET /api/v1/resumes/:id/download?type=original|ats_template
   */
  async downloadResume(req, res) {
    try {
      const { id } = req.params;
      const { type = 'original' } = req.query;
      const userId = req.user.id;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      // Find resume
      const resume = await database.prisma.resume.findFirst({
        where: {
          id,
          userId,
          isActive: true
        }
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESUME_NOT_FOUND',
            message: 'Resume not found'
          }
        });
      }

      let downloadUrl = resume.storageUrl;
      let filename = resume.originalName;

      if (type === 'ats_template' && resume.publicId) {
        downloadUrl = this.storageAdapter.generateATSTemplateUrl(resume.publicId);
        filename = `ATS_Optimized_${resume.originalName}`;
      }

      // Redirect to download URL
      res.redirect(downloadUrl);

    } catch (error) {
      logger.error('Resume download failed', {
        error: error.message,
        resumeId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'DOWNLOAD_FAILED',
          message: 'Failed to download resume'
        }
      });
    }
  }

  /**
   * Get resume analytics
   * GET /api/v1/resumes/:id/analytics
   */
  async getResumeAnalytics(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      // Find resume
      const resume = await database.prisma.resume.findFirst({
        where: {
          id,
          userId,
          isActive: true
        }
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESUME_NOT_FOUND',
            message: 'Resume not found'
          }
        });
      }

      // Calculate weak skills
      const weakSkills = Object.entries(resume.skillScores || {})
        .filter(([_, score]) => score < 90)
        .map(([skill, score]) => ({ skill, score }));

      // Get YouTube links for weak skills
      const youtubeLinks = await youtubeService.getYouTubeLinksForSkills(
        weakSkills.map(ws => ws.skill)
      );

      res.json({
        success: true,
        data: {
          resumeId: resume.id,
          overallScore: resume.atsScore,
          skillScores: resume.skillScores,
          weakSkills,
          youtubeLinks,
          recommendations: resume.metadata?.atsResult?.recommendations || [],
          atsStatus: resume.atsStatus,
          uploadedAt: resume.uploadedAt
        }
      });

    } catch (error) {
      logger.error('Resume analytics failed', {
        error: error.message,
        resumeId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'ANALYTICS_FAILED',
          message: 'Failed to get analytics'
        }
      });
    }
  }

  /**
   * Compare two resume versions
   * GET /api/v1/resumes/compare?firstId=:id1&secondId=:id2
   */
  async compareResumes(req, res) {
    try {
      const { firstId, secondId } = req.query;
      const userId = req.user.id;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      if (!firstId || !secondId) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Both firstId and secondId are required'
          }
        });
      }

      // Find both resumes
      const [firstResume, secondResume] = await Promise.all([
        database.prisma.resume.findFirst({
          where: {
            id: firstId,
            userId,
            isActive: true
          }
        }),
        database.prisma.resume.findFirst({
          where: {
            id: secondId,
            userId,
            isActive: true
          }
        })
      ]);

      if (!firstResume || !secondResume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESUME_NOT_FOUND',
            message: 'One or both resumes not found'
          }
        });
      }

      // Compare resumes
      const comparison = {
        // Basic information
        basic: {
          firstResume: {
            id: firstResume.id,
            filename: firstResume.originalName,
            uploadedAt: firstResume.uploadedAt,
            fileSize: firstResume.fileSize
          },
          secondResume: {
            id: secondResume.id,
            filename: secondResume.originalName,
            uploadedAt: secondResume.uploadedAt,
            fileSize: secondResume.fileSize
          }
        },
        
        // ATS scores comparison
        atsScores: {
          firstResume: firstResume.atsScore || 0,
          secondResume: secondResume.atsScore || 0,
          difference: (secondResume.atsScore || 0) - (firstResume.atsScore || 0),
          improvement: ((secondResume.atsScore || 0) - (firstResume.atsScore || 0)) > 0
        },
        
        // Skill scores comparison
        skillScores: this.compareSkillScores(firstResume.skillScores || {}, secondResume.skillScores || {}),
        
        // Text difference metrics (if available)
        textDifference: this.compareResumeText(firstResume.extractedText, secondResume.extractedText)
      };

      logger.info('Resume comparison completed', {
        userId,
        firstResumeId: firstId,
        secondResumeId: secondId
      });

      res.json({
        success: true,
        data: comparison
      });

    } catch (error) {
      logger.error('Resume comparison failed', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'COMPARISON_FAILED',
          message: 'Failed to compare resumes'
        }
      });
    }
  }

  /**
   * Compare skill scores between two resumes
   * @param {Object} firstSkills - First resume skill scores
   * @param {Object} secondSkills - Second resume skill scores
   * @returns {Object} Skill comparison data
   */
  compareSkillScores(firstSkills, secondSkills) {
    const allSkills = new Set([...Object.keys(firstSkills), ...Object.keys(secondSkills)]);
    const comparison = {
      improved: [],
      declined: [],
      unchanged: [],
      new: [],
      removed: []
    };

    allSkills.forEach(skill => {
      const firstScore = firstSkills[skill] || 0;
      const secondScore = secondSkills[skill] || 0;
      
      // Skill exists in both resumes
      if (skill in firstSkills && skill in secondSkills) {
        const difference = secondScore - firstScore;
        
        if (difference > 0) {
          comparison.improved.push({
            skill,
            firstScore,
            secondScore,
            difference
          });
        } else if (difference < 0) {
          comparison.declined.push({
            skill,
            firstScore,
            secondScore,
            difference
          });
        } else {
          comparison.unchanged.push({
            skill,
            score: firstScore
          });
        }
      }
      // Skill only in second resume (new skill)
      else if (skill in secondSkills) {
        comparison.new.push({
          skill,
          score: secondScore
        });
      }
      // Skill only in first resume (removed skill)
      else {
        comparison.removed.push({
          skill,
          score: firstScore
        });
      }
    });

    // Sort by absolute difference or score
    comparison.improved.sort((a, b) => b.difference - a.difference);
    comparison.declined.sort((a, b) => a.difference - b.difference);
    comparison.new.sort((a, b) => b.score - a.score);
    comparison.removed.sort((a, b) => b.score - a.score);

    return comparison;
  }

  /**
   * Compare text content between two resumes
   * @param {string} firstText - First resume text
   * @param {string} secondText - Second resume text
   * @returns {Object} Text comparison metrics
   */
  compareResumeText(firstText, secondText) {
    // If either text is missing, return null
    if (!firstText || !secondText) {
      return null;
    }

    // Simple text metrics
    const firstWords = firstText.split(/\s+/).filter(w => w.length > 0);
    const secondWords = secondText.split(/\s+/).filter(w => w.length > 0);
    
    // Calculate word count difference
    const wordCountDiff = secondWords.length - firstWords.length;
    const wordCountPercentage = firstWords.length > 0 
      ? ((secondWords.length - firstWords.length) / firstWords.length) * 100 
      : 0;
    
    // Calculate unique words
    const firstUniqueWords = new Set(firstWords.map(w => w.toLowerCase()));
    const secondUniqueWords = new Set(secondWords.map(w => w.toLowerCase()));
    
    // Find new and removed words
    const newWords = [...secondUniqueWords].filter(word => !firstUniqueWords.has(word));
    const removedWords = [...firstUniqueWords].filter(word => !secondUniqueWords.has(word));
    
    return {
      firstWordCount: firstWords.length,
      secondWordCount: secondWords.length,
      wordCountDiff,
      wordCountPercentage: parseFloat(wordCountPercentage.toFixed(2)),
      newUniqueWords: newWords.length,
      removedUniqueWords: removedWords.length,
      contentChangePercentage: parseFloat(
        ((newWords.length + removedWords.length) / 
        (firstUniqueWords.size + secondUniqueWords.size) * 100).toFixed(2)
      )
    };
  }

  /**
   * Request professional review
   * POST /api/v1/resumes/:id/request_review
   */
  async requestReview(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Check feature flag
      if (!req.featureFlags.isEnabled('resume_v2')) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FEATURE_DISABLED',
            message: 'Resume V2 feature is not enabled'
          }
        });
      }

      // Find resume
      const resume = await database.prisma.resume.findFirst({
        where: {
          id,
          userId,
          isActive: true
        }
      });

      if (!resume) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'RESUME_NOT_FOUND',
            message: 'Resume not found'
          }
        });
      }

      // Create review request
      const reviewRequest = await database.prisma.reviewRequest.create({
        data: {
          resumeId: resume.id,
          userId,
          status: 'PENDING',
          priority: 0
        }
      });

      logger.info('Review request created', {
        reviewRequestId: reviewRequest.id,
        resumeId: resume.id,
        userId
      });

      res.json({
        success: true,
        data: {
          reviewRequestId: reviewRequest.id,
          status: 'PENDING',
          message: 'Review request submitted successfully'
        }
      });

    } catch (error) {
      logger.error('Review request failed', {
        error: error.message,
        resumeId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'REVIEW_REQUEST_FAILED',
          message: 'Failed to submit review request'
        }
      });
    }
  }

  /**
   * Get user profile for ATS context
   * @param {string} userId - User ID
   * @returns {Object} User profile data
   */
  async getUserProfile(userId) {
    try {
      const user = await database.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              education: true,
              experience: true
            }
          }
        }
      });

      if (!user) return {};

      return {
        skills: user.profile?.skills || [],
        interests: user.profile?.interests || [],
        education: user.profile?.education || [],
        experience: user.profile?.experience || [],
        location: user.profile?.location
      };
    } catch (error) {
      logger.error('Failed to get user profile for ATS', {
        userId,
        error: error.message
      });
      return {};
    }
  }
}

export default new ResumeController();
