import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private (admin)
export const getActivities = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, timeRange, type, status, priority } = req.query;

    // Build query
    let query = {};

    // Time range filter
    if (timeRange) {
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                break;
        }

        if (startDate) {
            query.createdAt = { $gte: startDate };
        }
    }

    // Type filter
    if (type && type !== 'all') {
        query.activityType = type;
    }

    // Status filter
    if (status && status !== 'all') {
        query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
        query.priority = priority;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const activities = await Activity.find(query)
        .populate('performedBy', 'nameWithInitial firstName lastName position')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Activity.countDocuments(query);

    // Transform activities for frontend
    const transformedActivities = activities.map(activity => ({
        id: activity._id,
        type: activity.activityType,
        activityName: activity.activityName,
        description: activity.description,
        timestamp: activity.createdAt,
        performedBy: activity.performedByName,
        performedByUsername: activity.performedByUsername,
        performedByEmail: activity.performedByEmail,
        performedByRole: activity.performedByRole,
        faculty: activity.faculty,
        year: activity.year,
        fileName: activity.fileName,
        fileSize: activity.fileSize,
        status: activity.status,
        priority: activity.priority,
        metadata: activity.metadata
    }));

    res.status(200).json({
        success: true,
        count: transformedActivities.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        },
        data: transformedActivities
    });
});

// @desc    Get activity statistics
// @route   GET /api/activities/stats
// @access  Private (admin)
export const getActivityStats = asyncHandler(async (req, res) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = await Activity.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                new: {
                    $sum: { $cond: [{ $eq: ['$status', 'NEW'] }, 1, 0] }
                },
                critical: {
                    $sum: { $cond: [{ $eq: ['$priority', 'HIGH'] }, 1, 0] }
                },
                today: {
                    $sum: { $cond: [{ $gte: ['$createdAt', today] }, 1, 0] }
                },
                thisWeek: {
                    $sum: { $cond: [{ $gte: ['$createdAt', weekAgo] }, 1, 0] }
                },
                thisMonth: {
                    $sum: { $cond: [{ $gte: ['$createdAt', monthAgo] }, 1, 0] }
                }
            }
        }
    ]);

    const result = stats[0] || {
        total: 0,
        new: 0,
        critical: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0
    };

    res.status(200).json({
        success: true,
        data: result
    });
});

// @desc    Mark activity as read
// @route   PUT /api/activities/:id/read
// @access  Private (admin)
export const markActivityAsRead = asyncHandler(async (req, res, next) => {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
        return next(new ErrorResponse('Activity not found', 404));
    }

    activity.status = 'READ';
    await activity.save();

    res.status(200).json({
        success: true,
        data: activity
    });
});

// @desc    Mark all activities as read
// @route   PUT /api/activities/mark-all-read
// @access  Private (admin)
export const markAllActivitiesAsRead = asyncHandler(async (req, res) => {
    await Activity.updateMany(
        { status: 'NEW' },
        { status: 'READ' }
    );

    res.status(200).json({
        success: true,
        message: 'All activities marked as read'
    });
});

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private (admin)
export const getActivity = asyncHandler(async (req, res, next) => {
    const activity = await Activity.findById(req.params.id)
        .populate('performedBy', 'nameWithInitial firstName lastName position email');

    if (!activity) {
        return next(new ErrorResponse('Activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: activity
    });
});