import express from 'express';
import { 
    getUserProfile, 
    updatePhoneNumber, 
    updateProfileImage,
    changePassword,
    deleteAccount,
    getUserStats,
    updateDepartment
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

export default router;
