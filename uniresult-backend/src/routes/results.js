import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { protect, authorize } from '../middleware/auth.js';
import {
    uploadResult,
    getAllResults,
    getResultById,
    getMyResults,
    getMyResultsOrganized,
    getLatestResults,
    searchByRegistration,
    reparseResult,
    downloadResult,
    deleteResult,
    getNewResultsCount,
    linkStudentResults,
    getAllStudentResults,
    addManualStudentResults
} from '../controllers/results.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for PDF upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/uploads/results');
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
        cb(null, `result-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB max file size
    }
});

// Public routes (none for results)

// Protected routes - require authentication
router.use(protect);

// Student routes
router.get('/my-results', getMyResults);
router.get('/my-results-organized', getMyResultsOrganized);
router.get('/my-results/latest', getLatestResults);
router.get('/my-results/new-count', getNewResultsCount);
router.post('/link-student', linkStudentResults);

// Admin/ExamDiv routes
router.post('/upload', authorize('admin', 'examDiv'), upload.single('file'), uploadResult);
router.post('/:id/manual-results', authorize('admin', 'examDiv'), addManualStudentResults);
router.get('/', getAllResults);
router.get('/student-results', authorize('admin', 'examDiv'), getAllStudentResults);
router.get('/search/:registrationNo', authorize('admin', 'examDiv'), searchByRegistration);
router.get('/:id', getResultById);
router.get('/:id/download', downloadResult);
router.post('/:id/reparse', authorize('admin', 'examDiv'), reparseResult);
router.delete('/:id', authorize('admin'), deleteResult);

export default router;
