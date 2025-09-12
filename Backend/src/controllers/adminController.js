import database from '../config/database.js';
import logger from '../config/logger.js';
import uploadService from '../services/uploadService.js';

class AdminController {
  /**
   * Get admin dashboard data
   * GET /api/v1/admin/dashboard
   */
  async getDashboard(req, res) {
    try {
      const adminId = req.user.id;

      // Get comprehensive dashboard statistics
      const [
        totalUsers,
        totalStudents,
        totalAdmins,
        totalInternships,
        activeInternships,
        totalApplications,
        pendingApplications,
        categoryStats,
        recentActivity
      ] = await Promise.all([
        database.prisma.user.count(),
        database.prisma.user.count({ where: { role: 'STUDENT' } }),
        database.prisma.user.count({ where: { role: 'ADMIN' } }),
        database.prisma.internship.count(),
        database.prisma.internship.count({ where: { status: 'ACTIVE', isActive: true } }),
        database.prisma.application.count(),
        database.prisma.application.count({ where: { status: 'PENDING' } }),
        database.prisma.internship.groupBy({
          by: ['category'],
          _count: true,
          where: { isActive: true }
        }),
        database.prisma.application.findMany({
          take: 5,
          orderBy: { submittedAt: 'desc' },
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
        })
      ]);

      const dashboardData = {
        overview: {
          totalUsers,
          totalStudents,
          totalAdmins,
          totalInternships,
          activeInternships,
          totalApplications,
          pendingApplications
        },
        categoryStats: categoryStats.reduce((acc, item) => {
          acc[item.category] = item._count;
          return acc;
        }, {}),
        recentActivity: recentActivity.map(app => ({
          id: app.id,
          studentName: `${app.student.firstName} ${app.student.lastName}`,
          studentEmail: app.student.email,
          internshipTitle: app.internship.title,
          status: app.status,
          submittedAt: app.submittedAt
        }))
      };

      logger.info('Admin dashboard accessed', {
        adminId,
        totalUsers,
        totalInternships,
        totalApplications
      });

      res.status(200).json({
        success: true,
        data: {
          admin: {
            id: req.user.id,
            name: `${req.user.firstName} ${req.user.lastName}`,
            email: req.user.email,
            role: req.user.role
          },
          dashboard: dashboardData
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Admin dashboard error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'DASHBOARD_ERROR',
          message: 'Failed to load admin dashboard'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get all users for admin management
   * GET /api/v1/admin/users
   */
  async getUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        role,
        status,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const filters = {};

      if (role) filters.role = role;
      if (status) filters.status = status;
      if (search) {
        filters.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ];
      }

      const [users, totalCount] = await Promise.all([
        database.prisma.user.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { [sortBy]: sortOrder },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            isVerified: true,
            isActive: true,
            createdAt: true,
            lastLoginAt: true,
            profile: {
              select: {
                location: true,
                skills: true
              }
            },
            _count: {
              select: {
                applications: true
              }
            }
          }
        }),
        database.prisma.user.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          users,
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
      logger.error('Get users error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_USERS_FAILED',
          message: 'Failed to fetch users'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update user status (activate/deactivate)
   * PATCH /api/v1/admin/users/:id/status
   */
  async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, isActive } = req.body;

      const user = await database.prisma.user.findUnique({
        where: { id }
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

      // Prevent admin from modifying other admins
      if (user.role === 'ADMIN' && req.user.id !== id) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: 'Cannot modify other admin accounts'
          },
          timestamp: new Date().toISOString()
        });
      }

      const updateData = {};
      if (status !== undefined) updateData.status = status;
      if (isActive !== undefined) updateData.isActive = isActive;

      const updatedUser = await database.prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          status: true,
          isActive: true
        }
      });

      logger.info('User status updated by admin', {
        adminId: req.user.id,
        targetUserId: id,
        changes: updateData
      });

      res.status(200).json({
        success: true,
        message: 'User status updated successfully',
        data: { user: updatedUser },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update user status error', {
        error: error.message,
        adminId: req.user?.id,
        targetUserId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_USER_STATUS_FAILED',
          message: 'Failed to update user status'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get all applications for admin review
   * GET /api/v1/admin/applications
   */
  async getApplications(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        internshipId,
        sortBy = 'submittedAt',
        sortOrder = 'desc'
      } = req.query;

      const skip = (page - 1) * limit;
      const filters = {};

      if (status) filters.status = status;
      if (internshipId) filters.internshipId = internshipId;

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
                    location: true
                  }
                }
              }
            },
            internship: {
              select: {
                id: true,
                title: true,
                department: true,
                category: true
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
      logger.error('Get applications error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_APPLICATIONS_FAILED',
          message: 'Failed to fetch applications'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update application status
   * PATCH /api/v1/admin/applications/:id/status
   */
  async updateApplicationStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, reviewNotes } = req.body;

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

      const updateData = {
        status,
        reviewedAt: new Date(),
        reviewedBy: req.user.id
      };

      if (reviewNotes) updateData.reviewNotes = reviewNotes;

      const updatedApplication = await database.prisma.application.update({
        where: { id },
        data: updateData,
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

      logger.info('Application status updated by admin', {
        adminId: req.user.id,
        applicationId: id,
        newStatus: status,
        studentEmail: application.student.email
      });

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: { application: updatedApplication },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Update application status error', {
        error: error.message,
        adminId: req.user?.id,
        applicationId: req.params.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_APPLICATION_STATUS_FAILED',
          message: 'Failed to update application status'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get analytics data
   * GET /api/v1/admin/analytics
   */
  async getAnalytics(req, res) {
    try {
      const { period = '30d' } = req.query;

      // Calculate date range based on period
      const now = new Date();
      let startDate;
      
      switch (period) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const [
        userRegistrations,
        internshipCreations,
        applicationSubmissions,
        categoryDistribution,
        statusDistribution
      ] = await Promise.all([
        database.prisma.user.count({
          where: {
            createdAt: { gte: startDate }
          }
        }),
        database.prisma.internship.count({
          where: {
            createdAt: { gte: startDate }
          }
        }),
        database.prisma.application.count({
          where: {
            submittedAt: { gte: startDate }
          }
        }),
        database.prisma.internship.groupBy({
          by: ['category'],
          _count: true,
          where: {
            createdAt: { gte: startDate }
          }
        }),
        database.prisma.application.groupBy({
          by: ['status'],
          _count: true,
          where: {
            submittedAt: { gte: startDate }
          }
        })
      ]);

      const analytics = {
        period,
        startDate,
        endDate: now,
        metrics: {
          userRegistrations,
          internshipCreations,
          applicationSubmissions
        },
        categoryDistribution: categoryDistribution.reduce((acc, item) => {
          acc[item.category] = item._count;
          return acc;
        }, {}),
        statusDistribution: statusDistribution.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {})
      };

      res.status(200).json({
        success: true,
        data: { analytics },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get analytics error', {
        error: error.message,
        adminId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_ANALYTICS_FAILED',
          message: 'Failed to fetch analytics data'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

const adminController = new AdminController();
export default adminController;
