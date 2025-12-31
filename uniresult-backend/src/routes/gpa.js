import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getGPAAnalytics,
    getGPAByLevel,
    getGPABySemester,
    getGPATrend,
    calculateGPAScenario
} from '../controllers/gpa.js';

const router = express.Router();

// All GPA routes require authentication
router.use(protect);

// GPA Analytics routes (student only)
router.get('/analytics', getGPAAnalytics);
router.get('/by-level', getGPAByLevel);
router.get('/by-semester', getGPABySemester);
router.get('/trend', getGPATrend);
router.post('/calculate-scenario', calculateGPAScenario);

export default router;
