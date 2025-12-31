import Result from '../models/Result.js';
import StudentResult from '../models/StudentResult.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import pdfParser from '../services/pdfParser.js';
import { createResultNotification } from './notificationController.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload a result sheet and parse PDF
// @route   POST /api/results/upload
// @access  Private (Admin/ExamDiv)
export const uploadResult = async (req, res) => {
    try {
        const {
            faculty,
            department,
            level,
            semester,
            credits,
            subjectName,
            courseCode,
            academicYear,
            degreeProgram
        } = req.body;

        // Validate required fields
        if (!faculty || !department || !level || !semester || !subjectName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide faculty, department, level, semester, and subject name'
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a PDF file'
            });
        }

        const filePath = req.file.path;
        const fileUrl = `/uploads/results/${req.file.filename}`;

        // Create the result document first
        const result = await Result.create({
            faculty,
            department,
            level,
            semester,
            credits: credits ? parseInt(credits) : 0,
            subjectName,
            courseCode: courseCode || '',
            academicYear: academicYear || '',
            degreeProgram: degreeProgram || '',
            originalFileName: req.file.originalname,
            fileUrl,
            fileType: 'pdf',
            fileSize: req.file.size,
            uploadedBy: req.user.id || req.user._id,
            uploadedByName: req.user.name,
            uploadedByUsername: req.user.username,
            uploadedByEmail: req.user.email,
            uploadedByRole: req.user.role,
            parseStatus: 'processing'
        });

        // Get uploader details for activity
        let uploaderName = req.user.name || 'Unknown User';
        let uploaderUsername = req.user.username || 'Unknown';
        let uploaderEmail = req.user.email || 'unknown@example.com';
        let uploaderRole = req.user.role || 'unknown';
        let uploaderId = req.user.id || req.user._id;

        if (req.user.role === 'examDiv') {
            const ExamDivisionMember = (await import('../models/ExamDivisionMember.js')).default;
            const examMember = await ExamDivisionMember.findById(req.user.id);
            if (examMember) {
                uploaderName = `${examMember.firstName} ${examMember.lastName}`;
                uploaderUsername = examMember.username;
                uploaderEmail = examMember.email;
                uploaderRole = 'examDiv';
                uploaderId = examMember._id;
            }
        }

        // Create activity record for admin dashboard
        await Activity.create({
            activityType: 'RESULT_UPLOAD',
            activityName: 'Exam Result Uploaded',
            description: `Uploaded exam result for ${subjectName} (${faculty} - ${level} ${semester}) - ${req.file.originalname}`,
            performedBy: uploaderId,
            performedByName: uploaderName,
            performedByUsername: uploaderUsername,
            performedByEmail: uploaderEmail,
            performedByRole: uploaderRole,
            faculty: faculty,
            year: level,
            fileName: req.file.originalname,
            fileSize: req.file.size,
            status: 'NEW',
            priority: 'MEDIUM',
            metadata: {
                resultId: result._id,
                subjectName: subjectName,
                courseCode: courseCode,
                semester: semester,
                department: department
            }
        });

        // Parse the PDF asynchronously
        try {
            console.log('📄 Starting PDF parsing for:', req.file.originalname);
            console.log('📂 File path:', filePath);
            
            const parseResult = await pdfParser.parseFile(filePath);
            console.log('\n📊 Parse result:', {
                success: parseResult.success,
                studentCount: parseResult.studentResults?.length || 0,
                metadataExtracted: !!parseResult.metadata
            });
            
            if (parseResult.success && parseResult.studentResults.length > 0) {
                console.log(`\n✅ PDF parsed successfully: ${parseResult.studentResults.length} results extracted`);
                console.log('Sample results:', parseResult.studentResults.slice(0, 3).map(r => ({
                    reg: r.registrationNo,
                    grade: r.grade,
                    remark: r.remark
                })));
                
                // Update result with parsed data
                result.studentResults = parseResult.studentResults;
                result.resultCount = parseResult.studentResults.length;
                result.parseStatus = 'completed';
                result.parsedAt = new Date();
                
                // Update metadata if extracted from PDF
                if (parseResult.metadata.courseCode && !result.courseCode) {
                    result.courseCode = parseResult.metadata.courseCode;
                }
                if (parseResult.metadata.semester && !result.semester) {
                    result.semester = parseResult.metadata.semester;
                }
                if (parseResult.metadata.academicYear && !result.academicYear) {
                    result.academicYear = parseResult.metadata.academicYear;
                }
                
                await result.save();
                console.log('💾 Result sheet saved to database');

                // Create individual StudentResult entries for each student
                console.log('\n📝 Creating individual student result entries...');
                const createResult = await createStudentResults(result, parseResult.studentResults);
                console.log(`\n✅ Student results created: ${createResult.total} total, ${createResult.registered} registered, ${createResult.unregistered} not registered yet`);

                // Create notification for result update
                await createResultNotification({
                    faculty: result.faculty,
                    year: result.year,
                    semester: result.semester,
                    subjectCode: result.courseCode,
                    subjectName: result.subjectName
                }, req.user);

            } else if (parseResult.requiresManualEntry) {
                // PDF is scanned/image-based and requires manual entry
                console.log('⚠️ PDF requires manual entry:', parseResult.error);
                
                result.parseStatus = 'requires_manual_entry';
                result.resultCount = 0;
                result.parseError = parseResult.error || 'PDF appears to be scanned/image-based. Manual entry required.';
                result.parsedAt = new Date();
                await result.save();
                
                console.log('💾 Result sheet saved with manual entry required');
                
            } else {
                // PDF parsing failed or returned no results
                console.log('⚠️ PDF parsing completed but no results extracted');
                console.log('Used OCR:', parseResult.usedOCR || false);
                console.log('Raw text sample:', parseResult.rawText?.substring(0, 200));
                
                result.parseStatus = 'requires_manual_entry';
                result.resultCount = 0;
                result.parseError = 'PDF parsing failed to extract student results. Manual data entry required.';
                result.parsedAt = new Date();
                await result.save();
                
                console.log('💾 Result sheet saved with manual entry required');
            }
        } catch (parseError) {
            console.error('❌ PDF parsing error:', parseError);
            result.parseStatus = 'failed';
            result.parseError = parseError.message;
            await result.save();
        }

        res.status(201).json({
            success: true,
            message: 'Result uploaded successfully',
            data: {
                id: result._id,
                faculty: result.faculty,
                department: result.department,
                year: result.year,
                subjectName: result.subjectName,
                courseCode: result.courseCode,
                resultCount: result.resultCount,
                parseStatus: result.parseStatus,
                fileUrl: result.fileUrl,
                uploadedAt: result.createdAt
            }
        });

    } catch (error) {
        console.error('Upload result error:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading result',
            error: error.message
        });
    }
};

// Helper function to create individual student result entries
async function createStudentResults(resultSheet, studentResults) {
    try {
        console.log(`\n📝 Creating student result entries for ${studentResults.length} students...`);
        const studentResultDocs = [];
        let studentsFound = 0;
        let studentsNotFound = 0;

        for (const sr of studentResults) {
            console.log(`\n  Processing: ${sr.registrationNo} - Grade: ${sr.grade} - Remark: ${sr.remark || 'None'}`);
            
            // Check if student exists with this registration number
            const student = await User.findOne({
                $or: [
                    { enrollmentNumber: { $regex: new RegExp(`^${sr.registrationNo}$`, 'i') } },
                    { username: { $regex: new RegExp(`^${sr.registrationNo}$`, 'i') } }
                ]
            });

            if (student) {
                console.log(`  ✅ Found student: ${student.name} (${student.enrollmentNumber || student.username})`);
                studentsFound++;
            } else {
                console.log(`  ⚠️ Student not registered yet: ${sr.registrationNo}`);
                studentsNotFound++;
            }

            studentResultDocs.push({
                student: student ? student._id : null,
                registrationNo: sr.registrationNo,
                resultSheet: resultSheet._id,
                grade: sr.grade,
                remark: sr.remark || '',
                subjectName: resultSheet.subjectName,
                courseCode: resultSheet.courseCode,
                credits: resultSheet.credits,
                faculty: resultSheet.faculty,
                department: resultSheet.department,
                level: resultSheet.level,
                semester: resultSheet.semester,
                academicYear: resultSheet.academicYear,
                fileUrl: resultSheet.fileUrl,
                isViewed: false
            });
        }

        // Use insertMany with ordered: false to continue on duplicates
        if (studentResultDocs.length > 0) {
            console.log(`\n💾 Saving ${studentResultDocs.length} results to database...`);
            
            const result = await StudentResult.insertMany(studentResultDocs, { ordered: false })
                .catch(err => {
                    // Ignore duplicate key errors
                    if (err.code === 11000) {
                        console.log('⚠️ Some duplicate results were skipped');
                        return { insertedCount: err.insertedDocs?.length || 0 };
                    }
                    throw err;
                });
            
            console.log(`✅ Successfully saved ${result.insertedCount || studentResultDocs.length} student results`);
            console.log(`📊 Summary: ${studentsFound} registered students, ${studentsNotFound} not registered yet`);
            
            // Verify the results were actually saved in database
            const savedCount = await StudentResult.countDocuments({ resultSheet: studentResultDocs[0].resultSheet });
            console.log(`✅ Database verification: ${savedCount} results found in database for this result sheet`);
        }

        return { 
            total: studentResultDocs.length, 
            registered: studentsFound, 
            unregistered: studentsNotFound 
        };

    } catch (error) {
        console.error('❌ Error creating student results:', error);
        throw error;
    }
}

// @desc    Get all result sheets
// @route   GET /api/results
// @access  Private
export const getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .select('-studentResults') // Exclude student results for list view
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });

    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching results',
            error: error.message
        });
    }
};

// @desc    Get single result sheet with all student results
// @route   GET /api/results/:id
// @access  Private (Admin/ExamDiv)
export const getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Get result error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching result',
            error: error.message
        });
    }
};

// @desc    Get student's own results (for logged in student)
// @route   GET /api/results/my-results
// @access  Private (Student)
export const getMyResults = async (req, res) => {
    try {
        const user = req.user;
        
        // Get registration number from user
        const registrationNo = user.enrollmentNumber || user.username;
        
        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        // Find all results for this student
        const results = await StudentResult.find({
            registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') }
        })
        .populate('resultSheet', 'originalFileName uploadedByName createdAt')
        .sort({ createdAt: -1 });

        // Mark results as viewed
        const resultIds = results.map(r => r._id);
        await StudentResult.updateMany(
            { _id: { $in: resultIds }, isViewed: false },
            { $set: { isViewed: true, viewedAt: new Date() } }
        );

        res.status(200).json({
            success: true,
            count: results.length,
            registrationNo,
            data: results.map(r => ({
                id: r._id,
                subjectName: r.subjectName,
                courseCode: r.courseCode,
                credits: r.credits,
                grade: r.grade,
                remark: r.remark,
                faculty: r.faculty,
                department: r.department,
                academicYear: r.academicYear,
                semester: r.semester,
                year: r.year,
                fileUrl: r.fileUrl,
                resultSheetName: r.resultSheet?.originalFileName,
                uploadedBy: r.resultSheet?.uploadedByName,
                uploadedAt: r.resultSheet?.createdAt,
                viewedAt: r.viewedAt,
                createdAt: r.createdAt
            }))
        });

    } catch (error) {
        console.error('Get my results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your results',
            error: error.message
        });
    }
};

// @desc    Get student's results organized by level and semester
// @route   GET /api/results/my-results-organized
// @access  Private (Student)
export const getMyResultsOrganized = async (req, res) => {
    try {
        const user = req.user;

        // Get registration number from user
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        // Find all results for this student with flexible matching
        let results = [];

        // Try multiple matching strategies
        const matchingStrategies = [
            // Strategy 1: Exact match
            { query: { registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') } } },

            // Strategy 2: Match without slashes (for users like "UWUICT22")
            { query: { registrationNo: { $regex: new RegExp(`^${registrationNo.replace(/\//g, '')}$`, 'i') } } },

            // Strategy 3: Match core registration number (last part)
            (() => {
                const parts = registrationNo.split('/');
                const lastPart = parts[parts.length - 1];
                if (lastPart && lastPart.match(/\d{2,4}$/)) {
                    return { query: { registrationNo: { $regex: new RegExp(`${lastPart}$`, 'i') } } };
                }
                return null;
            })(),

            // Strategy 4: Match with normalized format (convert user format to PDF format)
            (() => {
                // If user has format like "UWUICT22", try to convert to "UWU/ICT/22/022"
                if (registrationNo.match(/^UWU[A-Z]+(\d+)$/)) {
                    const match = registrationNo.match(/^UWU([A-Z]+)(\d+)$/);
                    if (match) {
                        const dept = match[1];
                        const num = match[2];
                        // Try different year formats
                        const possibleFormats = [
                            `UWU/${dept}/22/${num}`,
                            `UWU/${dept}/23/${num}`,
                            `UWU/${dept}/21/${num}`
                        ];
                        return {
                            query: {
                                registrationNo: { $in: possibleFormats }
                            }
                        };
                    }
                }
                return null;
            })()
        ].filter(strategy => strategy !== null);

        // Try each strategy until we find results
        for (const strategy of matchingStrategies) {
            console.log('Trying matching strategy:', strategy.query);
            const foundResults = await StudentResult.find(strategy.query)
                .populate('resultSheet', 'originalFileName uploadedByName createdAt')
                .sort({ createdAt: -1 });

            if (foundResults.length > 0) {
                results = foundResults;
                console.log(`✅ Found ${results.length} results using strategy`);
                break;
            }
        }

        console.log(`Student ${registrationNo}: Found ${results.length} results`);

        // Organize results by level and semester
        const organizedData = {
            '100': {
                title: '100 Level',
                semesters: {
                    '1': { title: '1st Semester', subjects: [] },
                    '2': { title: '2nd Semester', subjects: [] }
                }
            },
            '200': {
                title: '200 Level',
                semesters: {
                    '3': { title: '3rd Semester', subjects: [] },
                    '4': { title: '4th Semester', subjects: [] }
                }
            },
            '300': {
                title: '300 Level',
                semesters: {
                    '5': { title: '5th Semester', subjects: [] },
                    '6': { title: '6th Semester', subjects: [] }
                }
            },
            '400': {
                title: '400 Level',
                semesters: {
                    '7': { title: '7th Semester', subjects: [] },
                    '8': { title: '8th Semester', subjects: [] }
                }
            }
        };

        // Map semester numbers to level-semester combinations
        const semesterToLevelMap = {
            '1st Semester': { level: '100', semester: '1' },
            '2nd Semester': { level: '100', semester: '2' },
            '3rd Semester': { level: '200', semester: '3' },
            '4th Semester': { level: '200', semester: '4' },
            '5th Semester': { level: '300', semester: '5' },
            '6th Semester': { level: '300', semester: '6' },
            '7th Semester': { level: '400', semester: '7' },
            '8th Semester': { level: '400', semester: '8' }
        };

        // Organize results into the structure
        results.forEach(result => {
            const semesterKey = result.semester;
            const mapping = semesterToLevelMap[semesterKey];

            if (mapping) {
                const { level, semester } = mapping;
                organizedData[level].semesters[semester].subjects.push({
                    code: result.courseCode || '',
                    title: result.subjectName,
                    creditCount: result.credits,
                    grade: result.grade,
                    status: result.grade ? 'completed' : 'pending',
                    updateDate: result.createdAt ? new Date(result.createdAt).toISOString().split('T')[0] : null
                });
            }
        });

        // Mark results as viewed
        const resultIds = results.map(r => r._id);
        await StudentResult.updateMany(
            { _id: { $in: resultIds }, isViewed: false },
            { $set: { isViewed: true, viewedAt: new Date() } }
        );

        res.status(200).json({
            success: true,
            registrationNo,
            data: organizedData
        });

    } catch (error) {
        console.error('Get organized results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your organized results',
            error: error.message
        });
    }
};

// @desc    Get student's latest results (most recent 5 updates)
// @route   GET /api/results/my-results/latest
// @access  Private (Student)
export const getLatestResults = async (req, res) => {
    try {
        const user = req.user;
        const limit = parseInt(req.query.limit) || 5;

        // Get registration number from user
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        // Find latest results for this student
        let results = [];

        // Try multiple matching strategies
        const matchingStrategies = [
            { query: { registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') } } },
            { query: { registrationNo: { $regex: new RegExp(`^${registrationNo.replace(/\//g, '')}$`, 'i') } } }
        ];

        for (const strategy of matchingStrategies) {
            const foundResults = await StudentResult.find(strategy.query)
                .populate('resultSheet', 'originalFileName uploadedByName createdAt')
                .sort({ createdAt: -1 })
                .limit(limit);

            if (foundResults.length > 0) {
                results = foundResults;
                break;
            }
        }

        // Map semester to level
        const semesterToLevel = {
            '1st Semester': 100,
            '2nd Semester': 100,
            '3rd Semester': 200,
            '4th Semester': 200,
            '5th Semester': 300,
            '6th Semester': 300,
            '7th Semester': 400,
            '8th Semester': 400
        };

        // Extract semester number from semester name
        const getSemesterNumber = (semesterName) => {
            const match = semesterName.match(/(\d+)/);
            return match ? match[1] : '1';
        };

        // Transform results to match frontend structure
        const latestResults = results.map(result => ({
            code: result.courseCode || '',
            subject: result.subjectName,
            level: semesterToLevel[result.semester] || 100,
            semester: parseInt(getSemesterNumber(result.semester)),
            grade: result.grade || 'N/A',
            updateDate: result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'N/A',
            isNew: result.isViewed ? false : true
        }));

        console.log(`✅ Found ${latestResults.length} latest results for ${registrationNo}`);

        res.status(200).json({
            success: true,
            count: latestResults.length,
            data: latestResults
        });

    } catch (error) {
        console.error('Get latest results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching latest results',
            error: error.message
        });
    }
};

// @desc    Search results by registration number
// @route   GET /api/results/search/:registrationNo
// @access  Private (Admin/ExamDiv)
export const searchByRegistration = async (req, res) => {
    try {
        const { registrationNo } = req.params;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a registration number'
            });
        }

        // Search in StudentResult collection
        const results = await StudentResult.find({
            registrationNo: { $regex: new RegExp(registrationNo, 'i') }
        })
        .populate('resultSheet', 'originalFileName uploadedByName createdAt faculty department year')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            searchQuery: registrationNo,
            data: results.map(r => ({
                id: r._id,
                registrationNo: r.registrationNo,
                subjectName: r.subjectName,
                courseCode: r.courseCode,
                credits: r.credits,
                grade: r.grade,
                remark: r.remark,
                faculty: r.faculty,
                department: r.department,
                academicYear: r.academicYear,
                semester: r.semester,
                year: r.year,
                fileUrl: r.fileUrl,
                resultSheetName: r.resultSheet?.originalFileName,
                uploadedBy: r.resultSheet?.uploadedByName,
                uploadedAt: r.resultSheet?.createdAt,
                createdAt: r.createdAt
            }))
        });

    } catch (error) {
        console.error('Search results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching results',
            error: error.message
        });
    }
};

// @desc    Re-parse a result PDF
// @route   POST /api/results/:id/reparse
// @access  Private (Admin/ExamDiv)
export const reparseResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found'
            });
        }

        // Get the file path
        const filePath = path.join(__dirname, '../../public', result.fileUrl);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'PDF file not found on server'
            });
        }

        // Re-parse the PDF
        result.parseStatus = 'processing';
        await result.save();

        try {
            const parseResult = await pdfParser.parseFile(filePath);

            if (parseResult.success) {
                // Delete old StudentResult entries
                await StudentResult.deleteMany({ resultSheet: result._id });

                // Update result with new parsed data
                result.studentResults = parseResult.studentResults;
                result.resultCount = parseResult.studentResults.length;
                result.parseStatus = 'completed';
                result.parsedAt = new Date();
                result.parseError = '';
                await result.save();

                // Create new StudentResult entries
                await createStudentResults(result, parseResult.studentResults);

                res.status(200).json({
                    success: true,
                    message: 'PDF re-parsed successfully',
                    data: {
                        resultCount: parseResult.studentResults.length,
                        parseStatus: 'completed'
                    }
                });
            } else {
                result.parseStatus = 'failed';
                result.parseError = 'No results found in PDF';
                await result.save();

                res.status(200).json({
                    success: true,
                    message: 'PDF parsed but no results found',
                    data: {
                        resultCount: 0,
                        parseStatus: 'completed'
                    }
                });
            }
        } catch (parseError) {
            result.parseStatus = 'failed';
            result.parseError = parseError.message;
            await result.save();

            res.status(500).json({
                success: false,
                message: 'Error parsing PDF',
                error: parseError.message
            });
        }

    } catch (error) {
        console.error('Reparse result error:', error);
        res.status(500).json({
            success: false,
            message: 'Error re-parsing result',
            error: error.message
        });
    }
};

// @desc    Download result file
// @route   GET /api/results/:id/download
// @access  Private
export const downloadResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found'
            });
        }

        const filePath = path.join(__dirname, '../../public', result.fileUrl);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.download(filePath, result.originalFileName);

    } catch (error) {
        console.error('Download result error:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading file',
            error: error.message
        });
    }
};

// @desc    Delete a result
// @route   DELETE /api/results/:id
// @access  Private (Admin)
export const deleteResult = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'Result not found'
            });
        }

        // Delete the file
        const filePath = path.join(__dirname, '../../public', result.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete associated StudentResult entries
        await StudentResult.deleteMany({ resultSheet: result._id });

        // Delete the result document
        await Result.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Result deleted successfully'
        });

    } catch (error) {
        console.error('Delete result error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting result',
            error: error.message
        });
    }
};

// @desc    Get new/unviewed results count for student
// @route   GET /api/results/my-results/new-count
// @access  Private (Student)
export const getNewResultsCount = async (req, res) => {
    try {
        const user = req.user;
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(200).json({
                success: true,
                count: 0
            });
        }

        const count = await StudentResult.countDocuments({
            registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') },
            isViewed: false
        });

        res.status(200).json({
            success: true,
            count
        });

    } catch (error) {
        console.error('Get new results count error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting new results count',
            error: error.message
        });
    }
};

// @desc    Link results to student when they register/login
// @route   POST /api/results/link-student
// @access  Private
export const linkStudentResults = async (req, res) => {
    try {
        const user = req.user;
        const registrationNo = user.enrollmentNumber || user.username;

        if (!registrationNo) {
            return res.status(400).json({
                success: false,
                message: 'No enrollment number associated with your account'
            });
        }

        // Link all matching results to this student
        const updateResult = await StudentResult.updateMany(
            { 
                registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') },
                student: null
            },
            { $set: { student: user.id || user._id } }
        );

        res.status(200).json({
            success: true,
            message: 'Results linked successfully',
            linkedCount: updateResult.modifiedCount
        });

    } catch (error) {
        console.error('Link student results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error linking results',
            error: error.message
        });
    }
};

// @desc    Get all student results from database (for verification)
// @route   GET /api/results/student-results
// @access  Private (Admin/ExamDiv)
export const getAllStudentResults = async (req, res) => {
    try {
        const { limit = 50, page = 1, registrationNo, resultSheet } = req.query;
        
        const query = {};
        if (registrationNo) {
            query.registrationNo = { $regex: new RegExp(registrationNo, 'i') };
        }
        if (resultSheet) {
            query.resultSheet = resultSheet;
        }

        const studentResults = await StudentResult.find(query)
            .populate('student', 'name enrollmentNumber username email')
            .populate('resultSheet', 'originalFileName uploadedAt')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await StudentResult.countDocuments(query);

        console.log(`📊 Retrieved ${studentResults.length} student results from database (Total: ${total})`);

        res.status(200).json({
            success: true,
            count: studentResults.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: studentResults.map(sr => ({
                id: sr._id,
                registrationNo: sr.registrationNo,
                studentName: sr.student?.name || 'Not Registered',
                studentEnrollment: sr.student?.enrollmentNumber || sr.student?.username || 'N/A',
                grade: sr.grade,
                remark: sr.remark,
                subjectName: sr.subjectName,
                courseCode: sr.courseCode,
                credits: sr.credits,
                level: sr.level,
                semester: sr.semester,
                academicYear: sr.academicYear,
                resultSheet: sr.resultSheet?.originalFileName || 'N/A',
                uploadedAt: sr.resultSheet?.uploadedAt,
                isViewed: sr.isViewed,
                createdAt: sr.createdAt
            }))
        });

    } catch (error) {
        console.error('Get student results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student results',
            error: error.message
        });
    }
};

// @desc    Manually add student results to a result sheet
// @route   POST /api/results/:id/manual-results
// @access  Private (Admin/ExamDiv)
export const addManualStudentResults = async (req, res) => {
    try {
        const { id } = req.params;
        const { studentResults } = req.body;

        // Validate input
        if (!Array.isArray(studentResults) || studentResults.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an array of student results'
            });
        }

        // Find the result sheet
        const resultSheet = await Result.findById(id);
        if (!resultSheet) {
            return res.status(404).json({
                success: false,
                message: 'Result sheet not found'
            });
        }

        // Validate each student result
        const validatedResults = [];
        for (const sr of studentResults) {
            if (!sr.registrationNo || !sr.grade) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid student result: registration number and grade are required`
                });
            }
            validatedResults.push({
                registrationNo: sr.registrationNo.toUpperCase().trim(),
                grade: sr.grade.trim(),
                remark: sr.remark?.trim() || ''
            });
        }

        console.log(`📝 Adding ${validatedResults.length} manual student results to result sheet: ${resultSheet.subjectName}`);

        // Create individual StudentResult entries
        const createResult = await createStudentResults(resultSheet, validatedResults);

        // Update result sheet status
        resultSheet.parseStatus = 'completed';
        resultSheet.resultCount = createResult.total;
        resultSheet.manualEntryCompletedAt = new Date();
        await resultSheet.save();

        console.log(`✅ Manual results added: ${createResult.total} total, ${createResult.registered} registered, ${createResult.unregistered} not registered yet`);

        res.status(201).json({
            success: true,
            message: 'Student results added successfully',
            data: {
                resultSheetId: id,
                totalAdded: createResult.total,
                registered: createResult.registered,
                unregistered: createResult.unregistered
            }
        });

    } catch (error) {
        console.error('Add manual results error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding manual results',
            error: error.message
        });
    }
};
