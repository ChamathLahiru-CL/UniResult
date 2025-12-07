import express from 'express';
import {
    getActivities,
    getActivityStats,
    markActivityAsRead,
    markAllActivitiesAsRead,
    getActivity
} from '../controllers/activity.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin authorization
router.use(protect);
router.use(authorize('admin'));

// Get all activities
router.get('/', getActivities);

// Get activity statistics
router.get('/stats', getActivityStats);

// Get single activity
router.get('/:id', getActivity);

// Mark activity as read
router.put('/:id/read', markActivityAsRead);

// Mark all activities as read
router.put('/mark-all-read', markAllActivitiesAsRead);

export default router;