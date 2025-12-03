import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
    uploadTimeTable,
    getTimeTables,
    getTimeTablesForStudent,
    getTimeTable,
    downloadTimeTable,
    updateTimeTable,
    deleteTimeTable,
    getTimeTableStats
} from '../controllers/timeTable.js';
import { protect, authorize } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../public/uploads/timetables');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `timetable-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: fileFilter
});

// All routes require authentication
router.use(protect);

// Upload time table - examDiv only
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum size allowed is 10MB.'
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
}, authorize('examDiv'), uploadTimeTable);

// Get all time tables - examDiv and admin
router.get('/', authorize('examDiv', 'admin'), getTimeTables);

// Get time tables for students - students can access their faculty's timetables
router.get('/student', authorize('student'), getTimeTablesForStudent);

// Get time table statistics - examDiv and admin
router.get('/stats', authorize('examDiv', 'admin'), getTimeTableStats);

// Get single time table
router.get('/:id', getTimeTable);

// Download time table
router.get('/:id/download', downloadTimeTable);

// Update time table - examDiv (own uploads) or admin
router.put('/:id', authorize('examDiv', 'admin'), updateTimeTable);

// Delete time table - examDiv (own uploads) or admin
router.delete('/:id', authorize('examDiv', 'admin'), deleteTimeTable);

export default router;