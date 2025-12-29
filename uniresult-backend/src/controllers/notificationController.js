import Notification from '../models/Notification.js';
import asyncHandler from '../middleware/async.js';

/**
 * @desc    Get all notifications for logged-in user
 * @route   GET /api/notifications
 * @access  Private (Student)
 */
export const getNotifications = asyncHandler(async (req, res) => {
    const user = req.user;
    
    console.log('📬 Getting notifications for user:', {
        id: user.id || user._id,
        username: user.username,
        faculty: user.faculty,
        year: user.year,
        role: user.role
    });
    
    const notifications = await Notification.getForUser(user, {
        limit: parseInt(req.query.limit) || 50
    });
    
    console.log(`✅ Found ${notifications.length} notifications for user`);
    
    res.json({
        success: true,
        count: notifications.length,
        data: notifications
    });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private (Student)
 */
export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }
    
    await notification.markAsReadByUser(req.user.id || req.user._id);
    
    res.json({
        success: true,
        message: 'Notification marked as read'
    });
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private (Student)
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
    const user = req.user;
    
    const query = {
        isActive: true,
        $or: [
            { 'recipients.faculty': user.faculty },
            { 'recipients.faculty': null } // Notifications for all faculties
        ]
    };
    
    if (user.year) {
        const yearCondition = [
            { 'recipients.year': user.year },
            { 'recipients.year': null }
        ];
        // Combine with existing $or condition
        query.$and = [
            { $or: query.$or },
            { $or: yearCondition }
        ];
        delete query.$or;
    }
    
    const notifications = await Notification.find(query);
    
    const updatePromises = notifications.map(notification => 
        notification.markAsReadByUser(user.id || user._id)
    );
    
    await Promise.all(updatePromises);
    
    res.json({
        success: true,
        message: 'All notifications marked as read',
        count: notifications.length
    });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private (Student)
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
    const user = req.user;
    
    const notifications = await Notification.getForUser(user);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    res.json({
        success: true,
        count: unreadCount
    });
});

/**
 * @desc    Create a new notification (Admin/Exam Division)
 * @route   POST /api/notifications
 * @access  Private (Admin/Exam Division)
 */
export const createNotification = asyncHandler(async (req, res) => {
    const {
        type,
        title,
        message,
        link,
        priority,
        recipients,
        metadata
    } = req.body;
    
    // Validate required fields
    if (!type || !title || !message || !recipients || !recipients.faculty) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }
    
    const notification = await Notification.create({
        type,
        title,
        message,
        link,
        priority: priority || 'normal',
        recipients,
        metadata,
        createdBy: {
            userId: req.user.id || req.user._id,
            name: req.user.name || req.user.username,
            role: req.user.role
        }
    });
    
    console.log('✅ Notification created:', notification._id);
    res.status(201).json({
        success: true,
        data: notification,
        message: 'Notification created successfully'
    });
});

/**
 * Helper function to create result update notification
 */
export const createResultNotification = async (resultData, uploadedBy) => {
    try {
        const notification = await Notification.create({
            type: 'result',
            title: `New Result: ${resultData.subjectName}`,
            message: `Results for ${resultData.subjectName} (${resultData.subjectCode}) have been updated for ${resultData.semester}, ${resultData.year}.`,
            link: '/dash/results',
            priority: 'high',
            recipients: {
                faculty: resultData.faculty,
                year: resultData.year,
                semester: resultData.semester
            },
            metadata: {
                subjectCode: resultData.subjectCode,
                subjectName: resultData.subjectName,
                semester: resultData.semester,
                year: resultData.year
            },
            createdBy: {
                userId: uploadedBy.id || uploadedBy._id,
                name: uploadedBy.name || uploadedBy.username,
                role: uploadedBy.role
            }
        });
        
        console.log('✅ Result notification created:', notification._id);
        return notification;
    } catch (error) {
        console.error('❌ Error creating result notification:', error);
        return null;
    }
};

/**
 * Helper function to create news notification
 */
export const createNewsNotification = async (news, uploadedBy) => {
    try {
        const notification = await Notification.create({
            type: 'news',
            title: `New Announcement: ${news.topic}`,
            message: `A new announcement has been posted: ${news.message.substring(0, 100)}...`,
            link: '/dash/news',
            priority: news.priority || 'normal',
            recipients: {
                faculty: news.faculty === 'All Faculties' ? null : news.faculty,
                year: null // News visible to all years in faculty
            },
            metadata: {
                newsId: news._id,
                newsTopic: news.topic
            },
            createdBy: {
                userId: uploadedBy.id || uploadedBy._id,
                name: uploadedBy.name || uploadedBy.username,
                role: uploadedBy.role
            }
        });
        
        console.log('✅ News notification created:', notification._id);
        return notification;
    } catch (error) {
        console.error('❌ Error creating news notification:', error);
        return null;
    }
};

/**
 * Helper function to create timetable notification
 */
export const createTimetableNotification = async (timetable, uploadedBy) => {
    try {
        const notification = await Notification.create({
            type: 'timetable',
            title: `New Exam Timetable Available`,
            message: `Examination timetable for ${timetable.faculty} - ${timetable.year} has been uploaded.`,
            link: '/dash/exam-time-table',
            priority: 'high',
            recipients: {
                faculty: timetable.faculty,
                year: timetable.year
            },
            metadata: {
                timetableId: timetable._id
            },
            createdBy: {
                userId: uploadedBy.id || uploadedBy._id,
                name: uploadedBy.name || uploadedBy.username,
                role: uploadedBy.role
            }
        });
        
        console.log('✅ Timetable notification created:', notification._id);
        return notification;
    } catch (error) {
        console.error('❌ Error creating timetable notification:', error);
        return null;
    }
};

/**
 * Helper function to create GPA update notification
 */
export const createGPANotification = async (studentData, gpaData) => {
    try {
        const notification = await Notification.create({
            type: 'gpa',
            title: `GPA Updated`,
            message: `Your GPA has been updated. Current GPA: ${gpaData.currentGPA.toFixed(2)} for ${gpaData.level}.`,
            link: '/dash/gpa-analytics',
            priority: 'normal',
            recipients: {
                faculty: studentData.faculty,
                year: gpaData.level,
                semester: null
            },
            metadata: {
                gpa: gpaData.currentGPA,
                level: gpaData.level
            },
            createdBy: {
                userId: null, // System generated
                name: 'System',
                role: 'admin'
            }
        });
        
        console.log('✅ GPA notification created:', notification._id);
        return notification;
    } catch (error) {
        console.error('❌ Error creating GPA notification:', error);
        return null;
    }
};
