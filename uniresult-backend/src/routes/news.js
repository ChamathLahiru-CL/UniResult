import express from 'express';
import {
    uploadNews,
    getNews,
    getNewsById,
    updateNews,
    deleteNews,
    markNewsAsRead,
    getNewsStats
} from '../controllers/news.js';
import { protect, authorize } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'public/uploads/news';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'news-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX, and TXT files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

const router = express.Router();

// Routes for exam division members
router.post('/', protect, authorize('examDiv'), upload.single('attachment'), uploadNews);
router.get('/', protect, getNews);
router.get('/stats', protect, authorize('examDiv'), getNewsStats);
router.get('/:id', protect, getNewsById);
router.put('/:id', protect, authorize('examDiv'), upload.single('attachment'), updateNews);
router.delete('/:id', protect, authorize('examDiv'), deleteNews);
router.put('/:id/read', protect, markNewsAsRead);

export default router;