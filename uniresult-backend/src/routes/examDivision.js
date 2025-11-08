import express from 'express';
import {
    createExamMember,
    getAllExamMembers,
    getExamMemberById,
    updateExamMember,
    updateMemberStatus,
    deleteExamMember
} from '../controllers/examDivision.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Create new exam division member
router.post('/members', createExamMember);

// Get all exam division members
router.get('/members', getAllExamMembers);

// Get single exam division member
router.get('/members/:id', getExamMemberById);

// Update exam division member
router.put('/members/:id', updateExamMember);

// Update member status
router.put('/members/:id/status', updateMemberStatus);

// Delete exam division member
router.delete('/members/:id', deleteExamMember);

export default router;
