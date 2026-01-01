import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getAcademicProgress,
    addAcademicAchievement,
    getAcademicAchievements
} from '../controllers/academicProgress.js';

const router = express.Router();

// All academic progress routes require authentication
router.use(protect);

// Student routes
router.get('/', getAcademicProgress);
router.get('/achievements', getAcademicAchievements);

// Admin/Exam Division routes for managing achievements
router.post('/achievement', addAcademicAchievement);

export default router;