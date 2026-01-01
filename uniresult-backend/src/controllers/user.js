import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { parseEnrollmentNumber } from '../utils/enrollmentParser.js';

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
                faculty: user.faculty || '',
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

// Update department
export const updateDepartment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { department } = req.body;

        console.log('\n🏫 Updating department for user:', userId);

        if (!department) {
            return res.status(400).json({
                success: false,
                message: 'Department is required'
            });
        }

        // Get user to validate faculty and enrollment number
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Validate department based on faculty
        const facultyDepartments = {
            'Faculty of Technological Studies': ['ICT', 'ET', 'BST'],
            'Faculty of Applied Science': ['SET', 'CST', 'IIT'],
            'Faculty of Management': ['ENM', 'EAG', 'English Lit'],
            'Faculty of Agriculture': ['TEA'],
            'Faculty of Medicine': ['DOC']
        };

        const validDepartments = facultyDepartments[user.faculty] || [];
        if (!validDepartments.includes(department)) {
            return res.status(400).json({
                success: false,
                message: `Invalid department for ${user.faculty}. Valid departments: ${validDepartments.join(', ')}`
            });
        }

        // Validate department against enrollment number format
        // Expected format: UWU/DEPARTMENT/YY/NNN
        const enrollmentParts = user.enrollmentNumber.split('/');
        if (enrollmentParts.length >= 4) {
            const enrollmentDept = enrollmentParts[1]; // Department part
            if (enrollmentDept !== department) {
                return res.status(400).json({
                    success: false,
                    message: `Department '${department}' does not match your enrollment number format. Expected: ${enrollmentDept}`
                });
            }
        }

        // Update department
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { department },
            { new: true, runValidators: true }
        ).select('-password');

        console.log('✅ Department updated successfully');

        res.json({
            success: true,
            message: 'Department updated successfully',
            data: {
                department: updatedUser.department
            }
        });
    } catch (error) {
        console.error('❌ Error updating department:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating department',
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

// @desc    Get all students (for admin)
// @route   GET /api/users/students
// @access  Private (admin only)
export const getAllStudents = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        console.log('\n👥 Fetching all students for admin:', req.user.username);

        // Get all students with their details
        const students = await User.find({ role: 'student' })
            .select('-password') // Exclude password
            .sort({ createdAt: -1 }); // Sort by newest first

        // Format the data for frontend
        const formattedStudents = students.map(student => {
            // Calculate year from enrollment number
            let year = null;
            if (student.enrollmentNumber) {
                const parsed = parseEnrollmentNumber(student.enrollmentNumber);
                if (parsed && parsed.year) {
                    const currentYear = new Date().getFullYear();
                    const enrollmentYear = parseInt(`20${parsed.year}`);
                    const yearDifference = currentYear - enrollmentYear;
                    if (yearDifference >= 0 && yearDifference <= 3) {
                        year = yearDifference + 1; // Convert to 1st, 2nd, 3rd, 4th year
                    }
                }
            }

            return {
                id: student._id,
                name: student.name || 'Unknown Student',
                email: student.email,
                username: student.username,
                enrollmentNumber: student.enrollmentNumber,
                department: student.department || '',
                faculty: student.faculty || '',
                year: year,
                matricNumber: student.enrollmentNumber, // Use enrollment number as matric number
                status: student.isActive ? 'Active' : 'Suspended',
                registrationDate: student.createdAt,
                phoneNumber: student.phoneNumber || '',
                lastLogin: student.lastLogin,
                program: student.department ? `${student.department} Program` : '', // Generate program name
                degree: student.department ? `BSc in ${student.department}` : '' // Generate degree name
            };
        });

        console.log(`✅ Found ${formattedStudents.length} students`);

        res.json({
            success: true,
            count: formattedStudents.length,
            data: formattedStudents
        });
    } catch (error) {
        console.error('❌ Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching students',
            error: error.message
        });
    }
};

// @desc    Suspend a student (admin only)
// @route   PUT /api/users/:id/suspend
// @access  Private (admin only)
export const suspendStudent = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        const { id } = req.params;
        // const { reason } = req.body; // Not currently used

        console.log(`\n🚫 Suspending student ${id} by admin:`, req.user.username);

        const student = await User.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (student.role !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'Can only suspend student accounts'
            });
        }

        student.isActive = false;
        await student.save();

        console.log(`✅ Student ${student.username} suspended`);

        res.json({
            success: true,
            message: 'Student suspended successfully',
            data: {
                id: student._id,
                username: student.username,
                name: student.name || 'Unknown Student',
                status: 'Suspended'
            }
        });
    } catch (error) {
        console.error('❌ Error suspending student:', error);
        res.status(500).json({
            success: false,
            message: 'Error suspending student',
            error: error.message
        });
    }
};

// @desc    Activate a student (admin only)
// @route   PUT /api/users/:id/activate
// @access  Private (admin only)
export const activateStudent = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        const { id } = req.params;

        console.log(`\n✅ Activating student ${id} by admin:`, req.user.username);

        const student = await User.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (student.role !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'Can only activate student accounts'
            });
        }

        student.isActive = true;
        await student.save();

        console.log(`✅ Student ${student.username} activated`);

        res.json({
            success: true,
            message: 'Student activated successfully',
            data: {
                id: student._id,
                username: student.username,
                name: student.name || 'Unknown Student',
                status: 'Active'
            }
        });
    } catch (error) {
        console.error('❌ Error activating student:', error);
        res.status(500).json({
            success: false,
            message: 'Error activating student',
            error: error.message
        });
    }
};

// @desc    Delete a student (admin only)
// @route   DELETE /api/users/:id
// @access  Private (admin only)
export const deleteStudent = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin role required.'
            });
        }

        const { id } = req.params;

        console.log(`\n🗑️ Deleting student ${id} by admin:`, req.user.username);

        const student = await User.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        if (student.role !== 'student') {
            return res.status(400).json({
                success: false,
                message: 'Can only delete student accounts'
            });
        }

        await User.findByIdAndDelete(id);

        console.log(`✅ Student ${student.username} deleted`);

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('❌ Error deleting student:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
};
