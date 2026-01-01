import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import process from 'process';
import path from 'path';
import connectDB from './config/database.js';
import config from './config/config.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import examDivisionRoutes from './routes/examDivision.js';
import timeTableRoutes from './routes/timeTable.js';
import activityRoutes from './routes/activity.js';
import newsRoutes from './routes/news.js';
import resultsRoutes from './routes/results.js';
import notificationRoutes from './routes/notificationRoutes.js';
import gpaRoutes from './routes/gpa.js';
import complianceRoutes from './routes/compliance.js';

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
    origin: ['http://localhost:5174', 'http://localhost:5173', 'http://127.0.0.1:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes); // Alias for /api/users to support frontend calls
app.use('/api/exam-division', examDivisionRoutes);
app.use('/api/timetable', timeTableRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/gpa', gpaRoutes);
app.use('/api/compliance', complianceRoutes);

// Error handler middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    console.error('Stack:', err.stack);
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error'
    });
});

// Health check routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to UniResult API' });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server is running',
        dbConnection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();

        const server = app.listen(config.PORT, () => {
            console.log(`
🚀 Server running on port ${config.PORT}
💾 Database: MongoDB Atlas
🌐 Environment: ${config.NODE_ENV}
            `);
        });

        // Handle server errors
        server.on('error', (err) => {
            console.error('❌ Server error:', err);
            process.exit(1);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('👋 SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('💤 Process terminated!');
                    process.exit(0);
                });
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();