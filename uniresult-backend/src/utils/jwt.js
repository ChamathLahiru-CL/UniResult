import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            studentId: user.studentId,
            role: user.role
        },
        config.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch {
        throw new Error('Invalid token');
    }
};

export const extractToken = (req) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.split(' ')[1];
};