import { verifyToken, extractToken } from '../utils/jwt.js';

export const protect = async (req, res, next) => {
    try {
        const token = extractToken(req);
        
        console.log('🔐 Auth Middleware - Token present:', !!token);
        
        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        const decoded = verifyToken(token);
        console.log('✅ Token decoded successfully. User ID:', decoded.id);
        req.user = decoded;
        next();
    } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        console.log('🔒 Authorization Check - Required roles:', roles, '| User role:', req.user.role);
        if (!roles.includes(req.user.role)) {
            console.log('❌ Authorization failed - User role not in allowed roles');
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
        console.log('✅ Authorization successful');
        next();
    };
};