import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { protect, authorize } from '../middleware/auth.js';
import {
  submitCompliance,
  getMyCompliances,
  getComplianceById,
  getAllCompliances,
  updateComplianceStatus,
  deleteCompliance,
  downloadAttachment,
  getExamDivisionCompliances,
  markAsRead,
  downloadCompliancePDF
} from '../controllers/complianceController.js';

const router = express.Router();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../public/uploads/compliance');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `compliance-${uniqueSuffix}-${nameWithoutExt}${ext}`);
  }
});

// File filter for allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PNG, JPG, PDF, TXT, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

/**
 * Student Routes
 */

// @route   POST /api/compliance
// @desc    Submit a new compliance
// @access  Private (Student, Exam Division)
router.post('/', protect, upload.array('attachments', 5), submitCompliance);

// @route   GET /api/compliance/my
// @desc    Get all compliances for logged-in student
// @access  Private (Student)
router.get('/my', protect, getMyCompliances);

// @route   GET /api/compliance/exam-division/list
// @desc    Get compliances for Exam Division
// @access  Private (Exam Division)
router.get('/exam-division/list', protect, authorize('examDiv', 'admin'), getExamDivisionCompliances);

/**
 * Admin/Exam Division Routes
 */

// @route   GET /api/compliance
// @desc    Get all compliances (Admin/Exam Division)
// @access  Private (Admin, Exam Division)
router.get('/', protect, authorize('admin', 'examDiv'), getAllCompliances);

// @route   GET /api/compliance/:id
// @desc    Get a single compliance by ID
// @access  Private
router.get('/:id', protect, getComplianceById);

// @route   GET /api/compliance/:id/pdf
// @desc    Download compliance as PDF document
// @access  Private
router.get('/:id/pdf', protect, downloadCompliancePDF);

// @route   POST /api/compliance/:id/read
// @desc    Mark compliance as read
// @access  Private (Admin, Exam Division)
router.post('/:id/read', protect, authorize('admin', 'examDiv'), markAsRead);

// @route   PUT /api/compliance/:id/status
// @desc    Update compliance status
// @access  Private (Admin, Exam Division)
router.put('/:id/status', protect, authorize('admin', 'examDiv'), updateComplianceStatus);

// @route   DELETE /api/compliance/:id
// @desc    Delete a compliance
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), deleteCompliance);

// @route   GET /api/compliance/:id/attachment/:attachmentId
// @desc    Download compliance attachment
// @access  Private
router.get('/:id/attachment/:attachmentId', protect, downloadAttachment);

export default router;
