import express from 'express';
import { 
    getUserProfile, 
    updatePhoneNumber, 
    updateProfileImage,
    changePassword,
    deleteAccount,
    getUserStats,
    updateDepartment,
    getAllStudents,
    suspendStudent,
    activateStudent,
    deleteStudent
} from '../controllers/user.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected - require authentication
router.use(protect);

// Profile routes
router.get('/profile', getUserProfile);
router.put('/phone', updatePhoneNumber);
router.put('/profile-image', updateProfileImage);
router.put('/department', updateDepartment);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);
router.get('/stats', getUserStats);

// Admin routes
router.get('/students', getAllStudents);
router.put('/:id/suspend', suspendStudent);
router.put('/:id/activate', activateStudent);
router.delete('/:id', deleteStudent);

export default router;
