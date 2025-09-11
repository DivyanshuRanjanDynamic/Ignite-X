import database from '../config/database.js';
import logger from '../config/logger.js';

class NotificationController {
  /**
   * Get user notifications
   * GET /api/v1/notifications
   */
  async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20, isRead } = req.query;

      const skip = (page - 1) * limit;
      const filters = { userId };

      if (isRead !== undefined) {
        filters.isRead = isRead === 'true';
      }

      const [notifications, totalCount] = await Promise.all([
        database.prisma.notification.findMany({
          where: filters,
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        database.prisma.notification.count({ where: filters })
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        success: true,
        data: {
          notifications,
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
      logger.error('Get user notifications error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_NOTIFICATIONS_FAILED',
          message: 'Failed to fetch notifications'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Mark notification as read
   * PATCH /api/v1/notifications/:id/read
   */
  async markNotificationAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await database.prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOTIFICATION_NOT_FOUND',
            message: 'Notification not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check ownership
      if (notification.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only mark your own notifications as read'
          },
          timestamp: new Date().toISOString()
        });
      }

      const updatedNotification = await database.prisma.notification.update({
        where: { id },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
        data: { notification: updatedNotification },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Mark notification as read error', {
        error: error.message,
        notificationId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'MARK_READ_FAILED',
          message: 'Failed to mark notification as read'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Mark all notifications as read
   * PATCH /api/v1/notifications/read-all
   */
  async markAllNotificationsAsRead(req, res) {
    try {
      const userId = req.user.id;

      const result = await database.prisma.notification.updateMany({
        where: {
          userId,
          isRead: false
        },
        data: {
          isRead: true,
          readAt: new Date()
        }
      });

      res.status(200).json({
        success: true,
        message: `Marked ${result.count} notifications as read`,
        data: { updatedCount: result.count },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Mark all notifications as read error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'MARK_ALL_READ_FAILED',
          message: 'Failed to mark all notifications as read'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Delete notification
   * DELETE /api/v1/notifications/:id
   */
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const notification = await database.prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOTIFICATION_NOT_FOUND',
            message: 'Notification not found'
          },
          timestamp: new Date().toISOString()
        });
      }

      // Check ownership
      if (notification.userId !== userId) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'ACCESS_DENIED',
            message: 'You can only delete your own notifications'
          },
          timestamp: new Date().toISOString()
        });
      }

      await database.prisma.notification.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Delete notification error', {
        error: error.message,
        notificationId: req.params.id,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'DELETE_NOTIFICATION_FAILED',
          message: 'Failed to delete notification'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get unread notifications count
   * GET /api/v1/notifications/unread-count
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;

      const unreadCount = await database.prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      });

      res.status(200).json({
        success: true,
        data: { unreadCount },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error('Get unread count error', {
        error: error.message,
        userId: req.user?.id
      });

      res.status(500).json({
        success: false,
        error: {
          code: 'FETCH_UNREAD_COUNT_FAILED',
          message: 'Failed to fetch unread notifications count'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

const notificationController = new NotificationController();
export default notificationController;
