import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            name,
            role,
            department
        } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this username or email'
            });
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            name,
            role,
            department
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.username,
                    name: user.name,
                    role: user.role,
                    token: token,
                    loginTime: new Date().toISOString()
                },
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error registering user',
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

        // Find user by username and role
        const user = await User.findOne({ 
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

        // Verify password using bcrypt directly
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('🔑 Password validation:', { 
            isValid: isPasswordValid,
            providedPassword: password,
            hasStoredPassword: !!user.password
        });
        
        if (!isPasswordValid) {
            console.log('❌ Password validation failed');
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user);

        // Create response matching frontend expectations
        const response = {
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.username,
                    name: user.name,
                    role: user.role,
                    token: token,
                    loginTime: new Date().toISOString()
                },
                token
            }
        };

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