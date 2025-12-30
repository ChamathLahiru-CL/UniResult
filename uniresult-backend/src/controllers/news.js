import News from '../models/News.js';
import ExamDivisionMember from '../models/ExamDivisionMember.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import { createNewsNotification } from './notificationController.js';
import fs from 'fs';

// @desc    Upload/Create news
// @route   POST /api/news
// @access  Private (examDiv)
export const uploadNews = asyncHandler(async (req, res, next) => {
    const { newsTopic, newsType, faculty, newsMessage, priority } = req.body;

    // Validation
    if (!newsTopic || !newsType || !faculty || !newsMessage) {
        return next(new ErrorResponse('Please provide all required fields', 400));
    }

    // Validate faculty
    const validFaculties = ['Faculty of Technological Studies', 'Faculty of Applied Science', 'Faculty of Management', 'Faculty of Agriculture', 'Faculty of Medicine', 'All Faculties'];
    if (!validFaculties.includes(faculty)) {
        return next(new ErrorResponse('Invalid faculty selected', 400));
    }

    // Validate news type
    const validNewsTypes = ['Announcement', 'Important Notice', 'Exam Update', 'General Information', 'Urgent Alert'];
    if (!validNewsTypes.includes(newsType)) {
        return next(new ErrorResponse('Invalid news type selected', 400));
    }

    // Get uploader details
    let uploaderName = 'Unknown User';
    let uploaderEmpNo = 'Unknown';
    let uploaderEmail = req.user.email || 'unknown@example.com';
    let uploaderRole = req.user.role || 'unknown';

    if (req.user.role === 'examDiv') {
        const examMember = await ExamDivisionMember.findById(req.user.id);
        if (examMember) {
            uploaderName = `${examMember.firstName} ${examMember.lastName}`;
            uploaderEmpNo = examMember.employeeNumber || examMember.username;
            uploaderEmail = examMember.email;
            uploaderRole = 'examDiv';
        }
    }

    // Handle file upload if present
    let fileData = {};
    if (req.file) {
        const fileUrl = `/uploads/news/${req.file.filename}`;
        fileData = {
            fileName: req.file.filename,
            originalFileName: req.file.originalname,
            filePath: req.file.path,
            fileUrl: fileUrl,
            fileType: req.file.mimetype.split('/')[1] || req.file.mimetype,
            fileSize: req.file.size
        };
    }

    // Create news record
    const news = await News.create({
        newsTopic,
        newsType,
        faculty,
        newsMessage,
        ...fileData,
        uploadedBy: req.user.id,
        uploadedByName: uploaderName,
        uploadedByEmpNo: uploaderEmpNo,
        uploadedByEmail: uploaderEmail,
        uploadedByRole: uploaderRole,
        status: 'active',
        priority: priority || 'medium'
    });

    // Create notification for news
    await createNewsNotification(news, req.user);

    res.status(201).json({
        success: true,
        data: news,
        message: 'News uploaded successfully'
    });
});

// @desc    Get all news
// @route   GET /api/news
// @access  Private
export const getNews = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, faculty, type, status } = req.query;

    console.log('📰 Get News Request - Faculty filter:', faculty);
    console.log('📰 Query params:', req.query);

    // Build query
    let query = {};

    // Faculty filter
    if (faculty && faculty !== 'all') {
        if (faculty === 'All Faculties') {
            query.faculty = 'All Faculties';
        } else {
            query.$or = [
                { faculty: faculty },
                { faculty: 'All Faculties' }
            ];
        }
    }

    console.log('📰 MongoDB Query:', JSON.stringify(query, null, 2));

    // Type filter
    if (type && type !== 'all') {
        query.newsType = type;
    }

    // Status filter
    if (status && status !== 'all') {
        query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const news = await News.find(query)
        .populate('uploadedBy', 'firstName lastName employeeNumber')
        .populate('readBy.userId', 'username email name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await News.countDocuments(query);
    
    console.log(`📰 Found ${news.length} news items for faculty: ${faculty || 'all'}`);
    if (news.length > 0) {
        console.log('📰 Sample news faculties:', news.map(n => ({ topic: n.newsTopic, faculty: n.faculty })));
    }

    res.status(200).json({
        success: true,
        count: news.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        },
        data: news
    });
});

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Private
export const getNewsById = asyncHandler(async (req, res, next) => {
    const news = await News.findById(req.params.id)
        .populate('uploadedBy', 'firstName lastName employeeNumber email');

    if (!news) {
        return next(new ErrorResponse('News not found', 404));
    }

    res.status(200).json({
        success: true,
        data: news
    });
});

// @desc    Update news
// @route   PUT /api/news/:id
// @access  Private (examDiv - only uploader can update)
export const updateNews = asyncHandler(async (req, res, next) => {
    let news = await News.findById(req.params.id);

    if (!news) {
        return next(new ErrorResponse('News not found', 404));
    }

    // Check if user is the uploader
    if (news.uploadedBy.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this news', 403));
    }

    const { newsTopic, newsType, faculty, newsMessage } = req.body;

    // Validation
    if (newsTopic) news.newsTopic = newsTopic;
    if (newsType) news.newsType = newsType;
    if (faculty) news.faculty = faculty;
    if (newsMessage) news.newsMessage = newsMessage;

    // Handle file update if present
    if (req.file) {
        // Delete old file if exists
        if (news.filePath && fs.existsSync(news.filePath)) {
            fs.unlinkSync(news.filePath);
        }

        const fileUrl = `/uploads/news/${req.file.filename}`;
        news.fileName = req.file.filename;
        news.originalFileName = req.file.originalname;
        news.filePath = req.file.path;
        news.fileUrl = fileUrl;
        news.fileType = req.file.mimetype.split('/')[1] || req.file.mimetype;
        news.fileSize = req.file.size;
    }

    await news.save();

    res.status(200).json({
        success: true,
        data: news,
        message: 'News updated successfully'
    });
});

// @desc    Delete news
// @route   DELETE /api/news/:id
// @access  Private (examDiv - only uploader can delete)
export const deleteNews = asyncHandler(async (req, res, next) => {
    const news = await News.findById(req.params.id);

    if (!news) {
        return next(new ErrorResponse('News not found', 404));
    }

    // Check if user is the uploader
    if (news.uploadedBy.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to delete this news', 403));
    }

    // Delete associated file if exists
    if (news.filePath && fs.existsSync(news.filePath)) {
        fs.unlinkSync(news.filePath);
    }

    await news.deleteOne();

    res.status(200).json({
        success: true,
        message: 'News deleted successfully'
    });
});

// @desc    Mark news as read
// @route   PUT /api/news/:id/read
// @access  Private
export const markNewsAsRead = asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new ErrorResponse('User not authenticated', 401));
    }

    const news = await News.findById(req.params.id);

    if (!news) {
        return next(new ErrorResponse('News not found', 404));
    }

    await news.markAsReadBy(req.user.id);

    res.status(200).json({
        success: true,
        message: 'News marked as read'
    });
});

// @desc    Get news statistics
// @route   GET /api/news/stats
// @access  Private (examDiv)
export const getNewsStats = asyncHandler(async (req, res) => {
    const stats = await News.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                active: {
                    $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
                },
                archived: {
                    $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
                },
                urgent: {
                    $sum: { $cond: [{ $eq: ['$priority', 'urgent'] }, 1, 0] }
                },
                withAttachments: {
                    $sum: { $cond: [{ $ne: ['$fileUrl', null] }, 1, 0] }
                }
            }
        }
    ]);

    const result = stats[0] || {
        total: 0,
        active: 0,
        archived: 0,
        urgent: 0,
        withAttachments: 0
    };

    res.status(200).json({
        success: true,
        data: result
    });
});