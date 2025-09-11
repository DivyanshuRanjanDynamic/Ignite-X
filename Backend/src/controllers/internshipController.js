import database from '../config/database.js';
import logger from '../config/logger.js';
import uploadService from '../services/uploadService.js';

class InternshipController {
  /**
   * Get all internships with filters and pagination
   * GET /api/v1/internships
   */
  async getInternships(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        type,
        location,
        skills,
        minStipend,
        maxStipend,
        duration,
        status = 'ACTIVE',
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const filters = { isActive: true };

      // Add filters
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (type) filters.type = type;
      if (location) filters.location = { $regex: location, $options: 'i' };
      if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
        filters.skills = { $in: skillsArray };
      }
      if (minStipend || maxStipend) {
        filters.stipend = {};
        if (minStipend) filters.stipend.$gte = parseFloat(minStipend);
        if (maxStipend) filters.stipend.$lte = parseFloat(maxStipend);
      }
      if (duration) filters.duration = parseInt(duration);

      // Date filter - only show internships with future application deadlines
      filters.applicationDeadline = { $gte: new Date() };

      const sortOptions = {};
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [internships, totalCount] = await Promise.all([
        database.prisma.internship.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { [sortBy]: sortOrder },
          include: {
            createdBy: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            _count: {
              select: {
                applications: true
              }
            }
          }
        }),
        database.prisma.internship.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          internships,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit),
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internships error', {
        error: error.message,
        stack: error.stack,
        query: req.query
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_INTERNSHIPS_FAILED',
          message: 'Failed to fetch internships'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get single internship by ID
   * GET /api/v1/internships/:id
   */
  async getInternshipById(req, res) {
    try {
      const { id } = req.params;

      const internship = await database.prisma.internship.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Increment view count
      await database.prisma.internship.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      });

      res.status(200).json({
        success: true,
        data: { internship },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship by ID error', {
        error: error.message,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_INTERNSHIP_FAILED',
          message: 'Failed to fetch internship details'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship categories
   * GET /api/v1/internships/categories
   */
  async getCategories(req, res) {
    try {
      const categories = [
        'TECHNOLOGY',
        'MARKETING',
        'FINANCE',
        'DESIGN',
        'CONTENT_WRITING',
        'RESEARCH',
        'OPERATIONS',
        'HUMAN_RESOURCES',
        'BUSINESS_DEVELOPMENT',
        'DATA_SCIENCE',
        'CONSULTING',
        'EDUCATION',
        'HEALTHCARE',
        'GOVERNMENT',
        'OTHER'
      ];

      res.status(200).json({
        success: true,
        data: { categories },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get categories error', { error: error.message });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_CATEGORIES_FAILED',
          message: 'Failed to fetch categories'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship statistics
   * GET /api/v1/internships/stats
   */
  async getStats(req, res) {
    try {
      const [
        totalInternships,
        activeInternships,
        totalApplications,
        categoryCounts
      ] = await Promise.all([
        database.prisma.internship.count(),
        database.prisma.internship.count({ where: { status: 'ACTIVE', isActive: true } }),
        database.prisma.application.count(),
        database.prisma.internship.groupBy({
          by: ['category'],
          _count: true,
          where: { isActive: true }
        })
      ]);

      const stats = {
        totalInternships,
        activeInternships,
        totalApplications,
        categoryCounts: categoryCounts.reduce((acc, item) => {
          acc[item.category] = item._count;
          return acc;
        }, {})
      };

      res.status(200).json({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship stats error', { error: error.message });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_STATS_FAILED',
          message: 'Failed to fetch internship statistics'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Search internships
   * GET /api/v1/internships/search
   */
  async searchInternships(req, res) {
    try {
      const {
        q: query,
        page = 1,
        limit = 10,
        category,
        type,
        location
      } = req.query;

      if (!query) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'QUERY_REQUIRED',
            message: 'Search query is required'
          },
          timestamp: new Date().toISOString()
        });
      }

      const skip = (page - 1) * limit;
      const filters = {
        isActive: true,
        status: 'ACTIVE',
        applicationDeadline: { $gte: new Date() },
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { skills: { $in: [new RegExp(query, 'i')] } },
          { department: { $regex: query, $options: 'i' } }
        ]
      };

      if (category) filters.category = category;
      if (type) filters.type = type;
      if (location) filters.location = { $regex: location, $options: 'i' };

      const [internships, totalCount] = await Promise.all([
        database.prisma.internship.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            createdBy: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            _count: {
              select: {
                applications: true
              }
            }
          }
        }),
        database.prisma.internship.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          internships,
          query,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit)
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Search internships error', {
        error: error.message,
        query: req.query
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'SEARCH_FAILED',
          message: 'Search failed. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship skills requirement
   * GET /api/v1/internships/:id/skills
   */
  async getInternshipSkills(req, res) {
    try {
      const { id } = req.params;

      const internship = await database.prisma.internship.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          skills: true,
          requirements: true
        }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        data: {
          skills: internship.skills,
          requirements: internship.requirements,
          internshipTitle: internship.title
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship skills error', {
        error: error.message,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_SKILLS_FAILED',
          message: 'Failed to fetch internship skills'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship recommendations for student
   * GET /api/v1/internships/recommendations
   */
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 10 } = req.query;

      // Get user's profile and skills
      const userProfile = await database.prisma.profile.findUnique({
        where: { userId },
        select: {
          skills: true,
          interests: true
        }
      });

      if (!userProfile) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'PROFILE_NOT_FOUND',
            message: 'User profile not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Get user's applied internships to exclude them
      const appliedInternshipIds = await database.prisma.application.findMany({
        where: { studentId: userId },
        select: { internshipId: true }
      });

      const excludeIds = appliedInternshipIds.map(app => app.internshipId);

      // Find recommended internships based on skills and interests
      const userSkills = [...(userProfile.skills || []), ...(userProfile.interests || [])];
      
      const filters = {
        isActive: true,
        status: 'ACTIVE',
        applicationDeadline: { $gte: new Date() },
        id: { $nin: excludeIds }
      };

      if (userSkills.length > 0) {
        filters.skills = { $in: userSkills };
      }

      const recommendations = await database.prisma.internship.findMany({
        where: filters,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        }
      });

      res.status(200).json({
        success: true,
        data: { recommendations },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get recommendations error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_RECOMMENDATIONS_FAILED',
          message: 'Failed to fetch recommendations'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Save/bookmark an internship
   * POST /api/v1/internships/:id/save
   */
  async saveInternship(req, res) {
    try {
      const { id: internshipId } = req.params;
      const userId = req.user.id;

      // Check if internship exists
      const internship = await database.prisma.internship.findUnique({
        where: { id: internshipId }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if already saved
      const existingSave = await database.prisma.savedInternship.findUnique({
        where: {
          userId_internshipId: {
            userId,
            internshipId
          }
        }
      });

      if (existingSave) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_SAVED',
            message: 'Internship is already saved'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Save the internship
      await database.prisma.savedInternship.create({
        data: {
          userId,
          internshipId
        }
      });

      res.status(200).json({
        success: true,
        message: 'Internship saved successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Save internship error', {
        error: error.message,
        userId: req.user?.id,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'SAVE_INTERNSHIP_FAILED',
          message: 'Failed to save internship'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Unsave/unbookmark an internship
   * DELETE /api/v1/internships/:id/save
   */
  async unsaveInternship(req, res) {
    try {
      const { id: internshipId } = req.params;
      const userId = req.user.id;

      const result = await database.prisma.savedInternship.deleteMany({
        where: {
          userId,
          internshipId
        }
      });

      if (result.count === 0) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_SAVED',
            message: 'Internship was not saved'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        message: 'Internship unsaved successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Unsave internship error', {
        error: error.message,
        userId: req.user?.id,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UNSAVE_INTERNSHIP_FAILED',
          message: 'Failed to unsave internship'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get saved internships for user
   * GET /api/v1/internships/saved
   */
  async getSavedInternships(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const skip = (page - 1) * limit;

      const [savedInternships, totalCount] = await Promise.all([
        database.prisma.savedInternship.findMany({
          where: { userId },
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' },
          include: {
            internship: {
              include: {
                createdBy: {
                  select: {
                    firstName: true,
                    lastName: true
                  }
                },
                _count: {
                  select: {
                    applications: true
                  }
                }
              }
            }
          }
        }),
        database.prisma.savedInternship.count({ where: { userId } })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          savedInternships: savedInternships.map(saved => saved.internship),
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit)
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get saved internships error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_SAVED_INTERNSHIPS_FAILED',
          message: 'Failed to fetch saved internships'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Apply to an internship
   * POST /api/v1/internships/:id/apply
   */
  async applyToInternship(req, res) {
    try {
      const { id: internshipId } = req.params;
      const userId = req.user.id;
      const { coverLetter, answers } = req.body;

      // Check if internship exists and is active
      const internship = await database.prisma.internship.findUnique({
        where: { id: internshipId }
      });

      if (!internship) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_FOUND',
            message: 'Internship not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      if (!internship.isActive || internship.status !== 'ACTIVE') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INTERNSHIP_NOT_ACTIVE',
            message: 'This internship is no longer accepting applications'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check application deadline
      if (new Date() > internship.applicationDeadline) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'APPLICATION_DEADLINE_PASSED',
            message: 'Application deadline has passed'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if already applied
      const existingApplication = await database.prisma.application.findUnique({
        where: {
          studentId_internshipId: {
            studentId: userId,
            internshipId
          }
        }
      });

      if (existingApplication) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_APPLIED',
            message: 'You have already applied to this internship'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Handle resume upload if provided
      let resumeUrl = null;
      if (req.files && req.files.resume && req.files.resume[0]) {
        const resumeData = await uploadService.processUpload(req.files.resume[0], 'resume');
        resumeUrl = resumeData.url;
      }

      // Create application
      const application = await database.prisma.application.create({
        data: {
          studentId: userId,
          internshipId,
          coverLetter,
          resumeUrl,
          answers: answers ? JSON.parse(answers) : null,
          status: 'PENDING'
        }
      });

      // Update internship current applications count
      await database.prisma.internship.update({
        where: { id: internshipId },
        data: {
          currentApplications: {
            increment: 1
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: { applicationId: application.id },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Apply to internship error', {
        error: error.message,
        userId: req.user?.id,
        internshipId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'APPLICATION_FAILED',
          message: 'Failed to submit application. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Create new internship (Admin only)
   * POST /api/v1/internships
   */
  async createInternship(req, res) {
    try {
      const adminId = req.user.id;
      const {
        title,
        description,
        shortDescription,
        category,
        type = 'REMOTE',
        department,
        location,
        duration,
        stipend,
        currency = 'INR',
        isStipendNegotiable = false,
        startDate,
        endDate,
        applicationDeadline,
        maxApplications = 100,
        skills = [],
        requirements = [],
        responsibilities = [],
        benefits = [],
        eligibility = [],
        isFeatured = false
      } = req.body;

      const internship = await database.prisma.internship.create({
        data: {
          title,
          description,
          shortDescription,
          category,
          type,
          department,
          location,
          duration: parseInt(duration),
          stipend: stipend ? parseFloat(stipend) : null,
          currency,
          isStipendNegotiable,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          applicationDeadline: new Date(applicationDeadline),
          maxApplications: parseInt(maxApplications),
          skills,
          requirements,
          responsibilities,
          benefits,
          eligibility,
          isFeatured,
          createdById: adminId,
          status: 'ACTIVE'
        },
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info('Internship created successfully', {
        internshipId: internship.id,
        createdBy: adminId,
        title
      });

      res.status(201).json({
        success: true,
        message: 'Internship created successfully',
        data: { internship },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Create internship error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'CREATE_INTERNSHIP_FAILED',
          message: 'Failed to create internship. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update internship (Admin only)
   * PUT /api/v1/internships/:id
   */
  async updateInternship(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Convert string numbers to integers/floats where needed
      if (updateData.duration) updateData.duration = parseInt(updateData.duration);
      if (updateData.stipend) updateData.stipend = parseFloat(updateData.stipend);
      if (updateData.maxApplications) updateData.maxApplications = parseInt(updateData.maxApplications);

      // Convert date strings to Date objects
      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
      if (updateData.applicationDeadline) updateData.applicationDeadline = new Date(updateData.applicationDeadline);

      const internship = await database.prisma.internship.update({
        where: { id },
        data: updateData,
        include: {
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      });

      logger.info('Internship updated successfully', {
        internshipId: id,
        updatedBy: req.user.id
      });

      res.status(200).json({
        success: true,
        message: 'Internship updated successfully',
        data: { internship },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update internship error', {
        error: error.message,
        internshipId: req.params.id,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_INTERNSHIP_FAILED',
          message: 'Failed to update internship. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Delete internship (Admin only)
   * DELETE /api/v1/internships/:id
   */
  async deleteInternship(req, res) {
    try {
      const { id } = req.params;

      // Soft delete by setting isActive to false
      const internship = await database.prisma.internship.update({
        where: { id },
        data: {
          isActive: false,
          status: 'CLOSED'
        }
      });

      logger.info('Internship deleted (soft delete)', {
        internshipId: id,
        deletedBy: req.user.id
      });

      res.status(200).json({
        success: true,
        message: 'Internship deleted successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Delete internship error', {
        error: error.message,
        internshipId: req.params.id,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_INTERNSHIP_FAILED',
          message: 'Failed to delete internship. Please try again.'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get internship applications (Admin only)
   * GET /api/v1/internships/:id/applications
   */
  async getInternshipApplications(req, res) {
    try {
      const { id: internshipId } = req.params;
      const { page = 1, limit = 10, status, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;

      const skip = (page - 1) * limit;
      const filters = { internshipId };

      if (status) filters.status = status;

      const [applications, totalCount] = await Promise.all([
        database.prisma.application.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { [sortBy]: sortOrder },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profile: {
                  select: {
                    skills: true,
                    location: true,
                    avatar: true
                  }
                }
              }
            }
          }
        }),
        database.prisma.application.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          applications,
          pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalItems: totalCount,
            itemsPerPage: parseInt(limit)
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get internship applications error', {
        error: error.message,
        internshipId: req.params.id,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_APPLICATIONS_FAILED',
          message: 'Failed to fetch internship applications'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

const internshipController = new InternshipController();
export default internshipController;
