import express from 'express';
import notificationController from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route GET /api/v1/notifications
 * @desc Get user notifications
 * @access Private
 */
router.get('/', authenticate, notificationController.getUserNotifications);

/**
 * @route PATCH /api/v1/notifications/:id/read
 * @desc Mark notification as read
 * @access Private
 */
router.patch('/:id/read', authenticate, notificationController.markNotificationAsRead);

/**
 * @route PATCH /api/v1/notifications/read-all
 * @desc Mark all notifications as read
 * @access Private
 */
router.patch('/read-all', authenticate, notificationController.markAllNotificationsAsRead);

/**
 * @route DELETE /api/v1/notifications/:id
 * @desc Delete notification
 * @access Private
 */
router.delete('/:id', authenticate, notificationController.deleteNotification);

/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get unread notifications count
 * @access Private
 */
router.get('/unread-count', authenticate, notificationController.getUnreadCount);

export default router;
