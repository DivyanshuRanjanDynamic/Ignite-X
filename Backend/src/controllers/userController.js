import database from '../config/database.js';
import logger from '../config/logger.js';
import uploadService from '../services/uploadService.js';

class UserController {
  /**
   * Get user profile by ID
   * GET /api/v1/users/:id/profile
   */
  async getUserProfile(req, res) {
    try {
      const { id } = req.params;
      const requesterId = req.user.id;
      const requesterRole = req.user.role;

      // Check permission: users can only view their own profile unless admin
      if (requesterRole !== 'ADMIN' && requesterId !== id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only view your own profile'
          },
          timestamp: new Date().toISOString()
        });
      }

      const user = await database.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          isVerified: true,
          createdAt: true,
          lastLoginAt: true,
          profile: {
            include: {
              education: true,
              experience: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        data: { user },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get user profile error', {
        error: error.message,
        userId: req.params.id,
        requesterId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_PROFILE_FAILED',
          message: 'Failed to fetch user profile'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/v1/users/:id/profile
   */
  async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      // Check permission: users can only update their own profile
      if (userId !== id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only update your own profile'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Separate user and profile data
      const { education, experience, ...profileData } = updateData;

      // Update profile
      const updatedProfile = await database.prisma.profile.upsert({
        where: { userId },
        update: profileData,
        create: {
          userId,
          ...profileData
        },
        include: {
          education: true,
          experience: true
        }
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { profile: updatedProfile },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update profile error', {
        error: error.message,
        userId: req.user?.id,
        profileId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_PROFILE_FAILED',
          message: 'Failed to update profile'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Upload profile picture
   * POST /api/v1/users/profile/picture
   */
  async uploadProfilePicture(req, res) {
    try {
      const userId = req.user.id;

      if (!req.files || !req.files.profilePicture || !req.files.profilePicture[0]) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE_PROVIDED',
            message: 'Profile picture file is required'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Upload to Cloudinary
      const uploadData = await uploadService.processUpload(
        req.files.profilePicture[0], 
        'profilePhoto'
      );

      // Update profile with new avatar URL
      await database.prisma.profile.upsert({
        where: { userId },
        update: { avatar: uploadData.url },
        create: {
          userId,
          avatar: uploadData.url
        }
      });

      // Store file metadata
      await database.prisma.file.create({
        data: {
          userId,
          fileName: uploadData.publicId,
          originalName: req.files.profilePicture[0].originalname,
          fileUrl: uploadData.url,
          publicId: uploadData.publicId,
          mimeType: req.files.profilePicture[0].mimetype,
          fileSize: uploadData.size,
          category: 'PROFILE_PICTURE'
        }
      });

      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: { avatarUrl: uploadData.url },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Upload profile picture error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPLOAD_FAILED',
          message: 'Failed to upload profile picture'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Upload resume
   * POST /api/v1/users/profile/resume
   */
  async uploadResume(req, res) {
    try {
      const userId = req.user.id;

      if (!req.files || !req.files.resume || !req.files.resume[0]) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE_PROVIDED',
            message: 'Resume file is required'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Upload to Cloudinary
      const uploadData = await uploadService.processUpload(
        req.files.resume[0], 
        'resume'
      );

      // Update profile with new resume URL
      await database.prisma.profile.upsert({
        where: { userId },
        update: { resume: uploadData.url },
        create: {
          userId,
          resume: uploadData.url
        }
      });

      // Store file metadata
      await database.prisma.file.create({
        data: {
          userId,
          fileName: uploadData.publicId,
          originalName: req.files.resume[0].originalname,
          fileUrl: uploadData.url,
          publicId: uploadData.publicId,
          mimeType: req.files.resume[0].mimetype,
          fileSize: uploadData.size,
          category: 'RESUME'
        }
      });

      res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: { resumeUrl: uploadData.url },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Upload resume error', {
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
   * Get user files by category
   * GET /api/v1/users/files/:category?
   */
  async getUserFiles(req, res) {
    try {
      const userId = req.user.id;
      const { category } = req.params;
      
      const whereClause = {
        userId,
        isActive: true
      };
      
      if (category) {
        whereClause.category = category.toUpperCase();
      }
      
      const files = await database.prisma.file.findMany({
        where: whereClause,
        select: {
          id: true,
          fileName: true,
          originalName: true,
          fileUrl: true,
          mimeType: true,
          fileSize: true,
          category: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      res.json({
        success: true,
        data: {
          files,
          totalCount: files.length
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to get user files', {
        error: error.message,
        userId: req.user.id,
        category: req.params.category
      });
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve files'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Delete user file
   * DELETE /api/v1/users/files/:fileId
   */
  async deleteUserFile(req, res) {
    try {
      const { fileId } = req.params;
      const userId = req.user.id;
      
      // Find the file and verify ownership
      const file = await database.prisma.file.findFirst({
        where: {
          id: fileId,
          userId,
          isActive: true
        }
      });
      
      if (!file) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'FILE_NOT_FOUND',
            message: 'File not found or you do not have permission to delete it'
          },
          timestamp: new Date().toISOString()
        });
      }
      
      // Delete from Cloudinary
      if (file.publicId) {
        await uploadService.deleteFile(file.publicId);
      }
      
      // Mark as inactive in database
      await database.prisma.file.update({
        where: { id: fileId },
        data: { isActive: false }
      });
      
      logger.info('File deleted successfully', {
        fileId,
        userId,
        fileName: file.fileName
      });
      
      res.json({
        success: true,
        message: 'File deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to delete file', {
        error: error.message,
        fileId: req.params.fileId,
        userId: req.user.id
      });
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete file'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Upload new file
   * POST /api/v1/users/files/upload
   */
  async uploadFile(req, res) {
    try {
      const userId = req.user.id;
      const { category } = req.body;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE_UPLOADED',
            message: 'No file uploaded'
          },
          timestamp: new Date().toISOString()
        });
      }
      
      const file = req.file;
      const fileType = category || 'OTHER';
      
      // Process upload
      const uploadData = await uploadService.processUpload(file, fileType.toLowerCase());
      
      if (!uploadData) {
        return res.status(500).json({
          success: false,
          error: {
            code: 'UPLOAD_FAILED',
            message: 'Failed to upload file'
          },
          timestamp: new Date().toISOString()
        });
      }
      
      // Save file metadata to database
      const savedFile = await database.prisma.file.create({
        data: {
          userId,
          fileName: uploadData.publicId,
          originalName: file.originalname,
          fileUrl: uploadData.url,
          publicId: uploadData.publicId,
          mimeType: file.mimetype,
          fileSize: uploadData.size,
          category: fileType.toUpperCase(),
        },
      });
      
      logger.info('File uploaded successfully', {
        fileId: savedFile.id,
        userId,
        fileName: file.originalname,
        category: fileType
      });
      
      res.json({
        success: true,
        data: {
          file: {
            id: savedFile.id,
            fileName: savedFile.fileName,
            originalName: savedFile.originalName,
            fileUrl: savedFile.fileUrl,
            mimeType: savedFile.mimeType,
            fileSize: savedFile.fileSize,
            category: savedFile.category,
            createdAt: savedFile.createdAt,
          }
        },
        message: 'File uploaded successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to upload file', {
        error: error.message,
        userId: req.user.id,
        category: req.body.category
      });
      
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to upload file'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get dashboard data
   * GET /api/v1/dashboard
   */
  async getDashboardData(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      if (userRole === 'STUDENT') {
        // Student dashboard data
        const [
          totalApplications,
          pendingApplications,
          recentApplications,
          recommendedInternships
        ] = await Promise.all([
          database.prisma.application.count({ where: { studentId: userId } }),
          database.prisma.application.count({ 
            where: { studentId: userId, status: 'PENDING' } 
          }),
          database.prisma.application.findMany({
            where: { studentId: userId },
            take: 5,
            orderBy: { submittedAt: 'desc' },
            include: {
              internship: {
                select: {
                  title: true,
                  category: true,
                  type: true
                }
              }
            }
          }),
          database.prisma.internship.findMany({
            where: {
              isActive: true,
              status: 'ACTIVE',
              applicationDeadline: { gte: new Date() }
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              title: true,
              category: true,
              type: true,
              stipend: true,
              applicationDeadline: true
            }
          })
        ]);

        const dashboardData = {
          stats: {
            totalApplications,
            pendingApplications,
            shortlistedApplications: await database.prisma.application.count({ 
              where: { studentId: userId, status: 'SHORTLISTED' } 
            }),
            selectedApplications: await database.prisma.application.count({ 
              where: { studentId: userId, status: 'SELECTED' } 
            })
          },
          recentApplications,
          recommendedInternships
        };

        res.status(200).json({
          success: true,
          data: dashboardData,
          timestamp: new Date().toISOString()
        });

      } else if (userRole === 'ADMIN') {
        // Admin dashboard data
        const [
          totalUsers,
          totalInternships,
          totalApplications,
          recentApplications
        ] = await Promise.all([
          database.prisma.user.count({ where: { role: 'STUDENT' } }),
          database.prisma.internship.count({ where: { isActive: true } }),
          database.prisma.application.count(),
          database.prisma.application.findMany({
            take: 10,
            orderBy: { submittedAt: 'desc' },
            include: {
              student: {
                select: { firstName: true, lastName: true }
              },
              internship: {
                select: { title: true, category: true }
              }
            }
          })
        ]);

        const dashboardData = {
          stats: {
            totalUsers,
            totalInternships,
            totalApplications,
            activeInternships: await database.prisma.internship.count({ 
              where: { status: 'ACTIVE', isActive: true } 
            })
          },
          recentApplications
        };

        res.status(200).json({
          success: true,
          data: dashboardData,
          timestamp: new Date().toISOString()
        });
      }

    } catch (error) {
      logger.error('Get dashboard data error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_DASHBOARD_FAILED',
          message: 'Failed to fetch dashboard data'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update user settings
   * PUT /api/v1/users/settings
   */
  async updateUserSettings(req, res) {
    try {
      const userId = req.user.id;
      const { notifications, privacy, language } = req.body;

      // Update user preferences in profile
      const updatedProfile = await database.prisma.profile.upsert({
        where: { userId },
        update: {
          // Add settings fields if they exist in schema, for now just store as simple fields
          languages: language ? [language] : undefined,
        },
        create: {
          userId,
          languages: language ? [language] : ['English'],
        }
      });

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: { profile: updatedProfile },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update user settings error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_SETTINGS_FAILED',
          message: 'Failed to update settings'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update user preferences
   * PUT /api/v1/users/preferences
   */
  async updateUserPreferences(req, res) {
    try {
      const userId = req.user.id;
      const { interests, skills, workPreference } = req.body;

      const updatedProfile = await database.prisma.profile.upsert({
        where: { userId },
        update: {
          interests: interests || undefined,
          skills: skills || undefined,
        },
        create: {
          userId,
          interests: interests || [],
          skills: skills || [],
        }
      });

      res.status(200).json({
        success: true,
        message: 'Preferences updated successfully',
        data: { profile: updatedProfile },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update user preferences error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_PREFERENCES_FAILED',
          message: 'Failed to update preferences'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get user statistics
   * GET /api/v1/users/stats
   */
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;

      const [totalApplications, pendingApplications, shortlistedApplications, selectedApplications] = await Promise.all([
        database.prisma.application.count({ where: { studentId: userId } }),
        database.prisma.application.count({ where: { studentId: userId, status: 'PENDING' } }),
        database.prisma.application.count({ where: { studentId: userId, status: 'SHORTLISTED' } }),
        database.prisma.application.count({ where: { studentId: userId, status: 'SELECTED' } })
      ]);

      const stats = {
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        selectedApplications,
        rejectedApplications: await database.prisma.application.count({ 
          where: { studentId: userId, status: 'REJECTED' } 
        }),
        responseRate: totalApplications > 0 ? 
          Math.round(((shortlistedApplications + selectedApplications) / totalApplications) * 100) : 0,
      };

      res.status(200).json({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get user stats error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_STATS_FAILED',
          message: 'Failed to fetch user statistics'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get user activity/recent actions
   * GET /api/v1/users/activity
   */
  async getUserActivity(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20 } = req.query;

      // Get recent applications as activity
      const recentApplications = await database.prisma.application.findMany({
        where: { studentId: userId },
        take: parseInt(limit),
        orderBy: { submittedAt: 'desc' },
        include: {
          internship: {
            select: {
              title: true,
              category: true,
              type: true
            }
          }
        }
      });

      // Transform to activity format
      const activities = recentApplications.map(app => ({
        id: app.id,
        type: 'application',
        action: 'Applied to internship',
        description: `Applied to ${app.internship.title}`,
        timestamp: app.submittedAt,
        status: app.status,
        metadata: {
          internshipTitle: app.internship.title,
          category: app.internship.category,
          type: app.internship.type
        }
      }));

      res.status(200).json({
        success: true,
        data: { activities },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get user activity error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ACTIVITY_FAILED',
          message: 'Failed to fetch user activity'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  async deactivateAccount(req, res) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Feature not implemented yet' }
    });
  }

  async deleteAccount(req, res) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Feature not implemented yet' }
    });
  }

  async getAllUsers(req, res) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Feature not implemented yet' }
    });
  }

  async updateUserStatus(req, res) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Feature not implemented yet' }
    });
  }

  async getAdminUserStats(req, res) {
    res.status(501).json({
      success: false,
      error: { code: 'NOT_IMPLEMENTED', message: 'Feature not implemented yet' }
    });
  }
}

const userController = new UserController();
export default userController;
