import User from '../models/User.js';
import ExamDivisionMember from '../models/ExamDivisionMember.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const {
            fullName,
            email,
            enrollmentNumber,
            password,
            confirmPassword,
            agreeTerms,
            role = 'student',
            department
        } = req.body;

        console.log('\n📝 Registration attempt:', { 
            fullName, 
            email,
            enrollmentNumber,
            hasPassword: !!password,
            agreeTerms,
            role 
        });

        // Validation
        if (!fullName || !email || !enrollmentNumber || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Check terms agreement
        if (!agreeTerms) {
            return res.status(400).json({
                success: false,
                message: 'You must agree to the Terms of Use and Privacy Policy'
            });
        }

        // Validate password strength (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if university email is valid
        if (!email.endsWith('@std.uwu.ac.lk')) {
            return res.status(400).json({
                success: false,
                message: 'Please use a valid university email address'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ 
            $or: [
                { email }, 
                { username: enrollmentNumber },
                { enrollmentNumber }
            ] 
        });

        if (userExists) {
            console.log('❌ User already exists:', { 
                email: userExists.email, 
                enrollmentNumber: userExists.enrollmentNumber 
            });
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or enrollment number'
            });
        }

        // Create new user
        const user = await User.create({
            username: enrollmentNumber,
            enrollmentNumber: enrollmentNumber,
            email,
            password,
            name: fullName,
            role,
            department: department || 'Not specified',
            agreeTerms,
            isActive: true,
            isVerified: false
        });

        console.log('✅ User created successfully:', { 
            username: user.username, 
            email: user.email,
            name: user.name 
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login to continue.',
            data: {
                user: {
                    id: user.username,
                    name: user.name,
                    email: user.email,
                    enrollmentNumber: user.enrollmentNumber,
                    role: user.role,
                    token: token,
                    registeredAt: new Date().toISOString()
                },
                token
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `This ${field} is already registered`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error registering user. Please try again.',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        console.log('\n🔐 Login attempt:', { 
            username, 
            role,
            hasPassword: !!password 
        });

        let user = null;
        let isExamDivMember = false;

        // Check if logging in as exam division member
        if (role === 'examDiv') {
            // Find exam division member by username
            user = await ExamDivisionMember.findOne({ username }).select('+password');
            isExamDivMember = true;

            if (!user) {
                console.log('❌ Exam Division member not found:', { username });
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check if member is active
            if (user.status !== 'Active') {
                console.log('❌ Exam Division member is not active:', { username, status: user.status });
                return res.status(403).json({
                    success: false,
                    message: `Your account is ${user.status}. Please contact the administrator.`
                });
            }

            console.log('✅ Exam Division member found:', { 
                username: user.username, 
                position: user.position,
                name: user.nameWithInitial,
                hasPassword: !!user.password
            });

        } else {
            // Find regular user by username and role
            user = await User.findOne({ 
                username,
                role 
            }).select('+password');

            if (!user) {
                console.log('❌ User not found:', { username, role });
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            console.log('✅ User found:', { 
                username: user.username, 
                role: user.role,
                name: user.name,
                hasPassword: !!user.password
            });
        }

        // Verify password using bcrypt directly
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('🔑 Password validation:', { 
            isValid: isPasswordValid,
            hasStoredPassword: !!user.password
        });
        
        if (!isPasswordValid) {
            console.log('❌ Password validation failed');
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last active/login
        if (isExamDivMember) {
            user.lastActive = new Date();
        } else {
            user.lastLogin = new Date();
        }
        await user.save();

        // Generate token with appropriate data
        const tokenPayload = isExamDivMember ? {
            id: user._id,
            username: user.username,
            role: 'examDiv',
            position: user.position,
            email: user.email,
            name: user.nameWithInitial
        } : user;

        const token = generateToken(tokenPayload);

        // Create response matching frontend expectations
        const response = {
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: isExamDivMember ? user.username : user.username,
                    userId: String(user._id),
                    name: isExamDivMember ? user.nameWithInitial : user.name,
                    firstName: isExamDivMember ? user.firstName : undefined,
                    lastName: isExamDivMember ? user.lastName : undefined,
                    email: user.email,
                    role: isExamDivMember ? 'examDiv' : user.role,
                    position: isExamDivMember ? user.position : undefined,
                    token: token,
                    loginTime: new Date().toISOString()
                },
                token
            }
        };

        console.log('✅ Login successful for:', isExamDivMember ? 'Exam Division Member' : 'User');

        res.json(response);

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};