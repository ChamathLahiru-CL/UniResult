import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        
        console.log('\n👤 Fetching profile for user:', userId);

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Profile fetched successfully:', user.username);

        // Split name into firstName and lastName
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        res.json({
            success: true,
            data: {
                adminId: user.role === 'admin' ? user.username : '',
                studentId: user.role === 'student' ? user.username : user.enrollmentNumber,
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: user.phoneNumber || '',
                profileImage: user.profileImage || null,
                username: user.username,
                enrollmentNumber: user.enrollmentNumber,
                department: user.department,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        console.error('❌ Error fetching profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

// Update phone number
export const updatePhoneNumber = async (req, res) => {
    try {
        const userId = req.user.id;
        const { phoneNumber } = req.body;

        console.log('\n📞 Updating phone number for user:', userId);

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { phoneNumber },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Phone number updated successfully');

        res.json({
            success: true,
            message: 'Phone number updated successfully',
            data: {
                phoneNumber: user.phoneNumber
            }
        });
    } catch (error) {
        console.error('❌ Error updating phone number:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating phone number',
            error: error.message
        });
    }
};

// Update profile image
export const updateProfileImage = async (req, res) => {
    try {
        const userId = req.user.id;
        const { profileImage } = req.body;

        console.log('\n🖼️ Updating profile image for user:', userId);

        if (!profileImage) {
            return res.status(400).json({
                success: false,
                message: 'Profile image is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Profile image updated successfully');

        res.json({
            success: true,
            message: 'Profile image updated successfully',
            data: {
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('❌ Error updating profile image:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile image',
            error: error.message
        });
    }
};

// Change password
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        console.log('\n🔑 Password change request for user:', userId);

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All password fields are required'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New passwords do not match'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Get user with password
        const user = await User.findById(userId).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            console.log('❌ Current password is incorrect');
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        console.log('✅ Password changed successfully');

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('❌ Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { confirmation } = req.body;

        console.log('\n⚠️ Account deletion request for user:', userId);

        if (confirmation !== 'DELETE') {
            return res.status(400).json({
                success: false,
                message: 'Please type DELETE to confirm account deletion'
            });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('✅ Account deleted successfully:', user.username);

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting account:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting account',
            error: error.message
        });
    }
};

// Get user statistics (for dashboard)
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('\n📊 Fetching stats for user:', userId);

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // You can expand this with actual exam results data later
        const stats = {
            totalExams: 0,
            completedExams: 0,
            averageGPA: 0,
            lastLoginDate: user.lastLogin || user.createdAt
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user statistics',
            error: error.message
        });
    }
};
