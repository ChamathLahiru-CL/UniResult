import Result from '../models/Result.js';
import StudentResult from '../models/StudentResult.js';
import User from '../models/User.js';
import pdfParser from '../services/pdfParser.js';
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
            year,
            credits,
            subjectName,
            courseCode,
            semester,
            academicYear,
            degreeProgram
        } = req.body;

        // Validate required fields
        if (!faculty || !department || !year || !subjectName) {
            return res.status(400).json({
                success: false,
                message: 'Please provide faculty, department, year, and subject name'
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
            year,
            credits: credits ? parseInt(credits) : 0,
            subjectName,
            courseCode: courseCode || '',
            semester: semester || '',
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

        // Parse the PDF asynchronously
        try {
            console.log('📄 Starting PDF parsing for:', req.file.originalname);
            const parseResult = await pdfParser.parseFile(filePath);
            
            if (parseResult.success && parseResult.studentResults.length > 0) {
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

                // Create individual StudentResult entries for each student
                await createStudentResults(result, parseResult.studentResults);

                console.log(`✅ PDF parsed successfully: ${parseResult.studentResults.length} results extracted`);
            } else {
                result.parseStatus = 'completed';
                result.resultCount = 0;
                result.parsedAt = new Date();
                await result.save();
                
                console.log('⚠️ PDF parsed but no results found');
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
        const studentResultDocs = [];

        for (const sr of studentResults) {
            // Check if student exists with this registration number
            const student = await User.findOne({
                $or: [
                    { enrollmentNumber: { $regex: new RegExp(`^${sr.registrationNo}$`, 'i') } },
                    { username: { $regex: new RegExp(`^${sr.registrationNo}$`, 'i') } }
                ]
            });

            studentResultDocs.push({
                student: student ? student._id : null,
                registrationNo: sr.registrationNo,
                resultSheet: resultSheet._id,
                grade: sr.grade,
                remark: sr.remark,
                subjectName: resultSheet.subjectName,
                courseCode: resultSheet.courseCode,
                credits: resultSheet.credits,
                faculty: resultSheet.faculty,
                department: resultSheet.department,
                academicYear: resultSheet.academicYear,
                semester: resultSheet.semester,
                year: resultSheet.year,
                fileUrl: resultSheet.fileUrl
            });
        }

        // Use insertMany with ordered: false to continue on duplicates
        if (studentResultDocs.length > 0) {
            await StudentResult.insertMany(studentResultDocs, { ordered: false }).catch(err => {
                // Ignore duplicate key errors
                if (err.code !== 11000) {
                    throw err;
                }
                console.log('Some duplicate results were skipped');
            });
        }

        console.log(`📊 Created ${studentResultDocs.length} student result entries`);
    } catch (error) {
        console.error('Error creating student results:', error);
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
