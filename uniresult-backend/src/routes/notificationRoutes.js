import express from 'express';
const router = express.Router();
import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    createNotification
} from '../controllers/notificationController.js';
import { protect, authorize } from '../middleware/auth.js';

// Student routes
router.get('/', protect, getNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

// Admin/Exam Division routes
router.post('/', protect, authorize('admin', 'examdivision'), createNotification);

export default router;
