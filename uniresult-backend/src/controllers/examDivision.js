import ExamDivisionMember from '../models/ExamDivisionMember.js';

// @desc    Create new exam division member
// @route   POST /api/exam-division/members
// @access  Private/Admin
export const createExamMember = async (req, res) => {
    try {
        const {
            nameWithInitial,
            firstName,
            lastName,
            email,
            username,
            password,
            phoneNumber,
            position
        } = req.body;

        // Validate required fields
        if (!nameWithInitial || !firstName || !lastName || !email || !username || !password || !phoneNumber || !position) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if member already exists
        const existingMember = await ExamDivisionMember.findOne({
            $or: [{ email }, { username }]
        });

        if (existingMember) {
            return res.status(400).json({
                success: false,
                message: existingMember.email === email 
                    ? 'Email already registered' 
                    : 'Username already exists'
            });
        }

        // Create new member
        const member = await ExamDivisionMember.create({
            nameWithInitial,
            firstName,
            lastName,
            email,
            username,
            password,
            phoneNumber,
            position,
            createdBy: req.user._id
        });

        // Return member without password
        const memberData = {
            id: member._id,
            nameWithInitial: member.nameWithInitial,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            username: member.username,
            phoneNumber: member.phoneNumber,
            position: member.position,
            status: member.status,
            joinDate: member.joinDate,
            lastActive: member.lastActive,
            createdAt: member.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'Exam Division member created successfully',
            data: memberData
        });

    } catch (error) {
        console.error('Create exam member error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating exam division member',
            error: error.message
        });
    }
};

// @desc    Get all exam division members
// @route   GET /api/exam-division/members
// @access  Private/Admin
export const getAllExamMembers = async (req, res) => {
    try {
        const members = await ExamDivisionMember.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: members.length,
            data: members
        });

    } catch (error) {
        console.error('Get exam members error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching exam division members',
            error: error.message
        });
    }
};

// @desc    Get single exam division member
// @route   GET /api/exam-division/members/:id
// @access  Private/Admin
export const getExamMemberById = async (req, res) => {
    try {
        const member = await ExamDivisionMember.findById(req.params.id).select('-password');

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Exam division member not found'
            });
        }

        res.status(200).json({
            success: true,
            data: member
        });

    } catch (error) {
        console.error('Get exam member error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching exam division member',
            error: error.message
        });
    }
};

// @desc    Update exam division member
// @route   PUT /api/exam-division/members/:id
// @access  Private/Admin
export const updateExamMember = async (req, res) => {
    try {
        const allowedUpdates = [
            'nameWithInitial',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'position',
            'status',
            'profileImage'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const member = await ExamDivisionMember.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Exam division member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Exam division member updated successfully',
            data: member
        });

    } catch (error) {
        console.error('Update exam member error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating exam division member',
            error: error.message
        });
    }
};

// @desc    Update member status (Active/Inactive/Suspended)
// @route   PUT /api/exam-division/members/:id/status
// @access  Private/Admin
export const updateMemberStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Active', 'Inactive', 'Suspended'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const member = await ExamDivisionMember.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).select('-password');

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Exam division member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Member status updated to ${status}`,
            data: member
        });

    } catch (error) {
        console.error('Update member status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating member status',
            error: error.message
        });
    }
};

// @desc    Delete exam division member
// @route   DELETE /api/exam-division/members/:id
// @access  Private/Admin
export const deleteExamMember = async (req, res) => {
    try {
        const member = await ExamDivisionMember.findByIdAndDelete(req.params.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Exam division member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Exam division member deleted successfully'
        });

    } catch (error) {
        console.error('Delete exam member error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting exam division member',
            error: error.message
        });
    }
};

// @desc    Get current exam division member's profile
// @route   GET /api/exam-division/profile
// @access  Private/ExamDiv
export const getProfile = async (req, res) => {
    try {
        console.log('📋 Fetching profile for user:', req.user);
        
        const member = await ExamDivisionMember.findById(req.user.id).select('-password');

        if (!member) {
            console.log('❌ Profile not found for ID:', req.user.id);
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        console.log('✅ Profile found:', member.username, member.nameWithInitial);
        res.status(200).json({
            success: true,
            data: member
        });

    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// @desc    Update current exam division member's profile
// @route   PUT /api/exam-division/profile
// @access  Private/ExamDiv
export const updateProfile = async (req, res) => {
    try {
        const allowedUpdates = [
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'position',
            'address',
            'emergencyContact',
            'profileImage'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        // Update nameWithInitial if firstName or lastName changed
        if (updates.firstName || updates.lastName) {
            const member = await ExamDivisionMember.findById(req.user.id);
            if (member) {
                updates.nameWithInitial = `${updates.firstName || member.firstName} ${updates.lastName || member.lastName}`;
            }
        }

        const member = await ExamDivisionMember.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: member
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Update current exam division member's password
// @route   PUT /api/exam-division/profile/password
// @access  Private/ExamDiv
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        const member = await ExamDivisionMember.findById(req.user.id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        // Check current password
        const isMatch = await member.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        member.password = newPassword;
        await member.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating password',
            error: error.message
        });
    }
};
