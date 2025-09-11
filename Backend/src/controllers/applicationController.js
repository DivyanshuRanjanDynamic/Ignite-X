import database from '../config/database.js';
import logger from '../config/logger.js';

class ApplicationController {
  /**
   * Get current user's applications
   * GET /api/v1/applications/my-applications
   */
  async getMyApplications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status, sortBy = 'submittedAt', sortOrder = 'desc' } = req.query;

      const skip = (page - 1) * limit;
      const filters = { studentId: userId };

      if (status) filters.status = status;

      const [applications, totalCount] = await Promise.all([
        database.prisma.application.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { [sortBy]: sortOrder },
          include: {
            internship: {
              select: {
                id: true,
                title: true,
                description: true,
                shortDescription: true,
                category: true,
                type: true,
                department: true,
                location: true,
                duration: true,
                stipend: true,
                currency: true,
                startDate: true,
                endDate: true,
                applicationDeadline: true,
                status: true,
                isActive: true,
                createdBy: {
                  select: {
                    firstName: true,
                    lastName: true
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
            itemsPerPage: parseInt(limit),
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get my applications error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_APPLICATIONS_FAILED',
          message: 'Failed to fetch your applications'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get single application by ID
   * GET /api/v1/applications/:id
   */
  async getApplicationById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const application = await database.prisma.application.findUnique({
        where: { id },
        include: {
          internship: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              type: true,
              department: true,
              location: true,
              duration: true,
              stipend: true,
              currency: true,
              startDate: true,
              endDate: true,
              applicationDeadline: true,
              skills: true,
              requirements: true,
              responsibilities: true,
              benefits: true,
              status: true,
              isActive: true,
              createdBy: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: {
                select: {
                  skills: true,
                  interests: true,
                  location: true,
                  avatar: true,
                  resume: true
                }
              }
            }
          }
        }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'APPLICATION_NOT_FOUND',
            message: 'Application not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Students can only view their own applications
      if (userRole === 'STUDENT' && application.studentId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only view your own applications'
          },
          timestamp: new Date().toISOString()
        });
      }

      res.status(200).json({
        success: true,
        data: { application },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get application by ID error', {
        error: error.message,
        applicationId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_APPLICATION_FAILED',
          message: 'Failed to fetch application details'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update application status (withdraw)
   * PATCH /api/v1/applications/:id/status
   */
  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      // Validate status
      const validStatuses = ['WITHDRAWN'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: 'Students can only withdraw applications'
          },
          timestamp: new Date().toISOString()
        });
      }

      const application = await database.prisma.application.findUnique({
        where: { id },
        include: {
          internship: {
            select: {
              title: true,
              currentApplications: true
            }
          }
        }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'APPLICATION_NOT_FOUND',
            message: 'Application not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if user owns the application
      if (application.studentId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only withdraw your own applications'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if application can be withdrawn
      if (application.status === 'WITHDRAWN') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'ALREADY_WITHDRAWN',
            message: 'Application has already been withdrawn'
          },
          timestamp: new Date().toISOString()
        });
      }

      if (['SELECTED', 'REJECTED'].includes(application.status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CANNOT_WITHDRAW',
            message: 'Cannot withdraw application that has been finalized'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Update application status
      const updatedApplication = await database.prisma.application.update({
        where: { id },
        data: {
          status,
          updatedAt: new Date()
        },
        include: {
          internship: {
            select: {
              title: true
            }
          }
        }
      });

      // Decrease internship application count if withdrawing
      if (status === 'WITHDRAWN' && application.status !== 'WITHDRAWN') {
        await database.prisma.internship.update({
          where: { id: application.internshipId },
          data: {
            currentApplications: {
              decrement: 1
            }
          }
        });
      }

      logger.info('Application status updated', {
        applicationId: id,
        userId,
        oldStatus: application.status,
        newStatus: status,
        internshipTitle: application.internship.title
      });

      res.status(200).json({
        success: true,
        message: `Application ${status.toLowerCase()} successfully`,
        data: { application: updatedApplication },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update application status error', {
        error: error.message,
        applicationId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_STATUS_FAILED',
          message: 'Failed to update application status'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get all applications (Admin only)
   * GET /api/v1/applications
   */
  async getAllApplications(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        status, 
        internshipId, 
        category,
        sortBy = 'submittedAt', 
        sortOrder = 'desc' 
      } = req.query;

      const skip = (page - 1) * limit;
      const filters = {};

      if (status) filters.status = status;
      if (internshipId) filters.internshipId = internshipId;

      // Filter by internship category if provided
      if (category) {
        filters.internship = {
          category: category
        };
      }

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
            },
            internship: {
              select: {
                id: true,
                title: true,
                category: true,
                type: true,
                department: true,
                location: true,
                duration: true,
                stipend: true,
                currency: true,
                applicationDeadline: true
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
            itemsPerPage: parseInt(limit),
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get all applications error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ALL_APPLICATIONS_FAILED',
          message: 'Failed to fetch applications'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Review application (Admin only)
   * PUT /api/v1/applications/:id/review
   */
  async reviewApplication(req, res) {
    try {
      const { id } = req.params;
      const { status, reviewNotes, priority = 0 } = req.body;
      const adminId = req.user.id;

      // Validate status
      const validStatuses = [
        'PENDING',
        'REVIEWED', 
        'SHORTLISTED',
        'INTERVIEW_SCHEDULED',
        'INTERVIEW_COMPLETED',
        'SELECTED',
        'REJECTED'
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_STATUS',
            message: `Invalid status. Valid statuses: ${validStatuses.join(', ')}`
          },
          timestamp: new Date().toISOString()
        });
      }

      const application = await database.prisma.application.findUnique({
        where: { id },
        include: {
          student: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          internship: {
            select: {
              title: true
            }
          }
        }
      });

      if (!application) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'APPLICATION_NOT_FOUND',
            message: 'Application not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check if application is already finalized
      if (application.status === 'WITHDRAWN') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'APPLICATION_WITHDRAWN',
            message: 'Cannot review a withdrawn application'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Update application
      const updatedApplication = await database.prisma.application.update({
        where: { id },
        data: {
          status,
          reviewNotes,
          priority: parseInt(priority),
          reviewedAt: new Date(),
          reviewedBy: adminId,
          updatedAt: new Date()
        },
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
          },
          internship: {
            select: {
              id: true,
              title: true,
              category: true,
              type: true,
              department: true,
              location: true
            }
          }
        }
      });

      // Create notification for student (if status changed significantly)
      const significantStatuses = ['SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'];
      if (significantStatuses.includes(status)) {
        await database.prisma.notification.create({
          data: {
            userId: application.studentId,
            type: 'APPLICATION_STATUS',
            title: `Application Status Updated`,
            message: `Your application for "${application.internship.title}" has been ${status.toLowerCase().replace('_', ' ')}.`,
            data: {
              applicationId: id,
              internshipId: application.internshipId,
              status,
              internshipTitle: application.internship.title
            }
          }
        });
      }

      logger.info('Application reviewed successfully', {
        applicationId: id,
        reviewedBy: adminId,
        studentEmail: application.student.email,
        oldStatus: application.status,
        newStatus: status,
        internshipTitle: application.internship.title
      });

      res.status(200).json({
        success: true,
        message: 'Application reviewed successfully',
        data: { application: updatedApplication },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Review application error', {
        error: error.message,
        applicationId: req.params.id,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'REVIEW_APPLICATION_FAILED',
          message: 'Failed to review application'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get application statistics (Admin only)
   * GET /api/v1/applications/stats
   */
  async getApplicationStats(req, res) {
    try {
      const [
        totalApplications,
        pendingApplications,
        reviewedApplications,
        shortlistedApplications,
        selectedApplications,
        rejectedApplications,
        withdrawnApplications,
        statusCounts,
        categoryCounts,
        recentApplications
      ] = await Promise.all([
        database.prisma.application.count(),
        database.prisma.application.count({ where: { status: 'PENDING' } }),
        database.prisma.application.count({ where: { status: 'REVIEWED' } }),
        database.prisma.application.count({ where: { status: 'SHORTLISTED' } }),
        database.prisma.application.count({ where: { status: 'SELECTED' } }),
        database.prisma.application.count({ where: { status: 'REJECTED' } }),
        database.prisma.application.count({ where: { status: 'WITHDRAWN' } }),
        database.prisma.application.groupBy({
          by: ['status'],
          _count: true
        }),
        database.prisma.application.findMany({
          select: {
            internship: {
              select: {
                category: true
              }
            }
          }
        }).then(apps => {
          const counts = {};
          apps.forEach(app => {
            const category = app.internship.category;
            counts[category] = (counts[category] || 0) + 1;
          });
          return counts;
        }),
        database.prisma.application.findMany({
          take: 10,
          orderBy: { submittedAt: 'desc' },
          select: {
            id: true,
            status: true,
            submittedAt: true,
            student: {
              select: {
                firstName: true,
                lastName: true
              }
            },
            internship: {
              select: {
                title: true,
                category: true
              }
            }
          }
        })
      ]);

      const stats = {
        totalApplications,
        pendingApplications,
        reviewedApplications,
        shortlistedApplications,
        selectedApplications,
        rejectedApplications,
        withdrawnApplications,
        statusDistribution: statusCounts.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {}),
        categoryDistribution: categoryCounts,
        recentApplications,
        conversionRate: totalApplications > 0 ? {
          reviewedRate: ((reviewedApplications + shortlistedApplications + selectedApplications + rejectedApplications) / totalApplications * 100).toFixed(2),
          shortlistedRate: (shortlistedApplications / totalApplications * 100).toFixed(2),
          selectionRate: (selectedApplications / totalApplications * 100).toFixed(2)
        } : {
          reviewedRate: 0,
          shortlistedRate: 0,
          selectionRate: 0
        }
      };

      res.status(200).json({
        success: true,
        data: { stats },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get application stats error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_STATS_FAILED',
          message: 'Failed to fetch application statistics'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

const applicationController = new ApplicationController();
export default applicationController;
