import express from 'express';
import {
    createExamMember,
    getAllExamMembers,
    getExamMemberById,
    updateExamMember,
    updateMemberStatus,
    deleteExamMember,
    getProfile,
    updateProfile,
    updatePassword,
    getMemberActivities
} from '../controllers/examDivision.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create new exam division member - admin only
router.post('/members', authorize('admin'), createExamMember);

// Get all exam division members - admin or examDiv
router.get('/members', authorize('admin', 'examDiv'), getAllExamMembers);

// Get single exam division member - admin or examDiv
router.get('/members/:id', authorize('admin', 'examDiv'), getExamMemberById);

// Get activities by member ID - admin or examDiv
router.get('/members/:id/activities', authorize('admin', 'examDiv'), getMemberActivities);

// Update exam division member - admin only
router.put('/members/:id', authorize('admin'), updateExamMember);

// Update member status - admin only
router.put('/members/:id/status', authorize('admin'), updateMemberStatus);

// Delete exam division member - admin only
router.delete('/members/:id', authorize('admin'), deleteExamMember);

// Get current exam division member's profile
router.get('/profile', authorize('examDiv'), getProfile);

// Update current exam division member's profile
router.put('/profile', authorize('examDiv'), updateProfile);

// Update current exam division member's password
router.put('/profile/password', authorize('examDiv'), updatePassword);

export default router;
