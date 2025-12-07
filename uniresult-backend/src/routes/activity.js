import express from 'express';
import {
    getActivities,
    getActivityStats,
    markActivityAsRead,
    markAllActivitiesAsRead,
    getActivity,
    getMyActivities
} from '../controllers/activity.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Routes for exam division members (their own activities) - MUST be before /:id
router.get('/my-activities', protect, authorize('examDiv'), getMyActivities);

// Routes for admin (require admin authorization)
router.get('/', protect, authorize('admin'), getActivities);
router.get('/stats', protect, authorize('admin'), getActivityStats);
router.put('/:id/read', protect, authorize('admin'), markActivityAsRead);
router.put('/mark-all-read', protect, authorize('admin'), markAllActivitiesAsRead);
router.get('/:id', protect, authorize('admin'), getActivity);

export default router;