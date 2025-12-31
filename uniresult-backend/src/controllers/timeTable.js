import TimeTable from '../models/TimeTable.js';
import User from '../models/User.js';
import ExamDivisionMember from '../models/ExamDivisionMember.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import { parseEnrollmentNumber } from '../utils/enrollmentParser.js';
import { createTimetableNotification } from './notificationController.js';
import fs from 'fs';

// @desc    Upload time table
// @route   POST /api/timetable/upload
// @access  Private (examDiv)
export const uploadTimeTable = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('Please upload a file', 400));
    }

    const { faculty, year } = req.body;

    if (!faculty || !year) {
        return next(new ErrorResponse('Please provide faculty and year', 400));
    }

    // Validate faculty and year
    const validFaculties = ['Faculty of Technological Studies', 'Faculty of Applied Science', 'Faculty of Management', 'Faculty of Agriculture', 'Faculty of Medicine'];
    const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

    if (!validFaculties.includes(faculty)) {
        return next(new ErrorResponse('Invalid faculty selected', 400));
    }

    if (!validYears.includes(year)) {
        return next(new ErrorResponse('Invalid year selected', 400));
    }

    // Get uploader details
    let uploaderName = 'Unknown User';
    let uploaderUsername = req.user.username || 'Unknown';
    let uploaderEmail = req.user.email || 'unknown@example.com';
    let uploaderRole = req.user.role || 'unknown';

    if (req.user.role === 'examDiv') {
        const examMember = await ExamDivisionMember.findById(req.user.id);
        if (examMember) {
            uploaderName = `${examMember.firstName} ${examMember.lastName}`;
            uploaderUsername = examMember.username;
            uploaderEmail = examMember.email;
            uploaderRole = 'examDiv';
        }
    } else {
        const user = await User.findById(req.user.id);
        if (user) {
            uploaderName = user.name;
            uploaderUsername = user.username;
            uploaderEmail = user.email;
            uploaderRole = user.role;
        }
    }

    // Create file URL
    const fileUrl = `/uploads/timetables/${req.file.filename}`;

    // Create time table record
    const timeTable = await TimeTable.create({
        faculty,
        year,
        fileName: req.file.filename,
        originalFileName: req.file.originalname,
        filePath: req.file.path,
        fileUrl,
        fileType: req.file.mimetype.split('/')[1],
        fileSize: req.file.size,
        uploadedBy: req.user.id,
        uploadedByName: uploaderName,
        uploadedByUsername: uploaderUsername,
        uploadedByEmail: uploaderEmail,
        uploadedByRole: uploaderRole
    });

    // Create activity record for admin dashboard
    await Activity.create({
        activityType: 'TIMETABLE_UPLOAD',
        activityName: 'Exam Time Table Updated',
        description: `Updated exam time table for ${faculty} - ${year} (${req.file.originalname})`,
        performedBy: req.user.role === 'examDiv' ? req.user.id : null,
        performedByName: uploaderName,
        performedByUsername: uploaderUsername,
        performedByEmail: uploaderEmail,
        performedByRole: uploaderRole,
        faculty: faculty,
        year: year,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        status: 'NEW',
        priority: 'MEDIUM',
        metadata: {
            timeTableId: timeTable._id,
            fileType: req.file.mimetype.split('/')[1]
        }
    });

    // Create notification for timetable upload
    await createTimetableNotification({
        _id: timeTable._id,
        faculty: timeTable.faculty,
        year: timeTable.year
    }, req.user);

    res.status(201).json({
        success: true,
        data: timeTable
    });
});

// @desc    Get all time tables
// @route   GET /api/timetable
// @access  Private (examDiv, admin)
export const getTimeTables = asyncHandler(async (req, res) => {
    const { faculty, year, page = 1, limit = 10, search } = req.query;

    // Build query
    let query = { isActive: true };

    if (faculty) query.faculty = faculty;
    if (year) query.year = year;
    if (search) {
        query.$or = [
            { originalFileName: { $regex: search, $options: 'i' } },
            { uploadedByName: { $regex: search, $options: 'i' } }
        ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const timeTables = await TimeTable.find(query)
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const total = await TimeTable.countDocuments(query);

    res.status(200).json({
        success: true,
        count: timeTables.length,
        total,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / parseInt(limit))
        },
        data: timeTables
    });
});

// @desc    Get time tables for students (by faculty)
// @route   GET /api/timetable/student
// @access  Private (student)
export const getTimeTablesForStudent = asyncHandler(async (req, res, next) => {
    // Get student details from authenticated user
    const student = await User.findById(req.user.id);

    if (!student) {
        return next(new ErrorResponse('Student not found', 404));
    }

    // Get student's faculty from their profile
    const studentFaculty = student.faculty;

    // Determine student's year from enrollment number
    let studentYear = null;
    if (student.enrollmentNumber) {
        const parsed = parseEnrollmentNumber(student.enrollmentNumber);
        if (parsed && parsed.year) {
            // Convert year format (e.g., "22" -> "3rd Year" based on current year)
            const currentYear = new Date().getFullYear();
            const enrollmentYear = parseInt(`20${parsed.year}`);
            const yearDifference = currentYear - enrollmentYear;

            if (yearDifference === 0) studentYear = '1st Year';
            else if (yearDifference === 1) studentYear = '2nd Year';
            else if (yearDifference === 2) studentYear = '3rd Year';
            else if (yearDifference === 3) studentYear = '4th Year';
        }
    }

    // Build query - filter by faculty only (show all years for the faculty)
    const query = {
        faculty: studentFaculty,
        isActive: true
    };

    // Get all timetables for the student's faculty (all years)
    const timeTables = await TimeTable.find(query)
        .populate('uploadedBy', 'name')
        .sort({ year: 1, createdAt: -1 }); // Sort by year first, then by creation date

    res.status(200).json({
        success: true,
        count: timeTables.length,
        data: timeTables,
        studentInfo: {
            faculty: studentFaculty,
            year: studentYear,
            enrollmentNumber: student.enrollmentNumber
        }
    });
});

// @desc    Get single time table
// @route   GET /api/timetable/:id
// @access  Private
export const getTimeTable = asyncHandler(async (req, res, next) => {
    const timeTable = await TimeTable.findById(req.params.id)
        .populate('uploadedBy', 'name email');

    if (!timeTable) {
        return next(new ErrorResponse('Time table not found', 404));
    }

    res.status(200).json({
        success: true,
        data: timeTable
    });
});

// @desc    Download time table
// @route   GET /api/timetable/:id/download
// @access  Private
export const downloadTimeTable = asyncHandler(async (req, res, next) => {
    try {
        const timeTable = await TimeTable.findById(req.params.id);

        if (!timeTable) {
            return next(new ErrorResponse('Time table not found', 404));
        }

        console.log('📥 Download request for:', timeTable.originalFileName);
        console.log('📂 File path:', timeTable.filePath);
        console.log('📂 File exists:', fs.existsSync(timeTable.filePath));

        // Check if file exists
        if (!fs.existsSync(timeTable.filePath)) {
            console.error('❌ File not found at path:', timeTable.filePath);
            return next(new ErrorResponse('File not found on server', 404));
        }

        // Increment download count directly without validation
        try {
            await TimeTable.findByIdAndUpdate(
                req.params.id,
                { 
                    $inc: { downloadCount: 1 },
                    lastDownloaded: new Date()
                },
                { runValidators: false }
            );
            console.log('✅ Download count incremented');
        } catch (downloadCountError) {
            console.log('⚠️ Could not increment download count:', downloadCountError.message);
            // Continue with download even if count increment fails
        }

        // Set headers for download
        const contentType = timeTable.fileType === 'pdf' ? 'application/pdf' : `image/${timeTable.fileType}`;
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${timeTable.originalFileName}"`);

        console.log('✅ Streaming file to client');

        // Stream file
        const fileStream = fs.createReadStream(timeTable.filePath);
        
        fileStream.on('error', (error) => {
            console.error('❌ File stream error:', error);
            return next(new ErrorResponse('Error reading file', 500));
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error('❌ Download error:', error);
        return next(new ErrorResponse('Download failed', 500));
    }
});

// @desc    Update time table
// @route   PUT /api/timetable/:id
// @access  Private (examDiv - only own uploads, admin - all)
export const updateTimeTable = asyncHandler(async (req, res, next) => {
    let timeTable = await TimeTable.findById(req.params.id);

    if (!timeTable) {
        return next(new ErrorResponse('Time table not found', 404));
    }

    // Check permissions
    if (req.user.role === 'examDiv' && timeTable.uploadedBy.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to update this time table', 403));
    }

    const { faculty, year } = req.body;

    // Validate if provided
    if (faculty) {
        const validFaculties = ['Faculty of Technological Studies', 'Faculty of Applied Science', 'Faculty of Management', 'Faculty of Agriculture', 'Faculty of Medicine'];
        if (!validFaculties.includes(faculty)) {
            return next(new ErrorResponse('Invalid faculty selected', 400));
        }
    }

    if (year) {
        const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        if (!validYears.includes(year)) {
            return next(new ErrorResponse('Invalid year selected', 400));
        }
    }

    timeTable = await TimeTable.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: timeTable
    });
});

// @desc    Delete time table
// @route   DELETE /api/timetable/:id
// @access  Private (examDiv - only own uploads, admin - all)
export const deleteTimeTable = asyncHandler(async (req, res, next) => {
    const timeTable = await TimeTable.findById(req.params.id);

    if (!timeTable) {
        return next(new ErrorResponse('Time table not found', 404));
    }

    // Check permissions
    if (req.user.role === 'examDiv' && timeTable.uploadedBy.toString() !== req.user.id) {
        return next(new ErrorResponse('Not authorized to delete this time table', 403));
    }

    // Delete file from filesystem
    if (fs.existsSync(timeTable.filePath)) {
        fs.unlinkSync(timeTable.filePath);
    }

    await timeTable.deleteOne();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get time table statistics
// @route   GET /api/timetable/stats
// @access  Private (examDiv, admin)
export const getTimeTableStats = asyncHandler(async (req, res) => {
    const stats = await TimeTable.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: { faculty: '$faculty', year: '$year' },
                count: { $sum: 1 },
                totalSize: { $sum: '$fileSize' },
                latestUpload: { $max: '$createdAt' }
            }
        },
        {
            $group: {
                _id: '$_id.faculty',
                years: {
                    $push: {
                        year: '$_id.year',
                        count: '$count',
                        totalSize: '$totalSize',
                        latestUpload: '$latestUpload'
                    }
                },
                totalUploads: { $sum: '$count' },
                totalSize: { $sum: '$totalSize' }
            }
        }
    ]);

    // Get overall stats
    const overallStats = await TimeTable.aggregate([
        { $match: { isActive: true } },
        {
            $group: {
                _id: null,
                totalUploads: { $sum: 1 },
                totalSize: { $sum: '$fileSize' },
                totalDownloads: { $sum: '$downloadCount' }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            faculties: stats,
            overall: overallStats[0] || { totalUploads: 0, totalSize: 0, totalDownloads: 0 }
        }
    });
});