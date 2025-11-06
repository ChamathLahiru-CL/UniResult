import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import User from '../models/User.js';

const testConnection = async () => {
    try {
        // Connect to MongoDB
        const conn = await mongoose.connect(config.MONGODB_URI);
        console.log('\n✅ MongoDB Connected Successfully');
        console.log('Database:', conn.connection.name);
        console.log('Host:', conn.connection.host);

        // Create test user
        const testUser = {
            username: 'ST2024001',
            password: 'Test@123',
            role: 'student',
            email: 'test.student@uniresult.com',
            name: 'Test Student',
            department: 'Computer Science'
        };

        // Delete existing test user
        await User.deleteOne({ username: testUser.username });
        console.log('\n✅ Cleaned up existing test user');

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUser.password, salt);
        testUser.password = hashedPassword;

        // Create new user
        const user = await User.create(testUser);
        console.log('\n✅ Test user created:', {
            username: user.username,
            role: user.role,
            name: user.name
        });

        // Test finding user
        const foundUser = await User.findOne({ 
            username: testUser.username,
            role: testUser.role 
        }).select('+password');

        console.log('\n✅ User search test:', foundUser ? 'Found' : 'Not Found');

        if (foundUser) {
            // Test password comparison
            const isPasswordValid = await bcrypt.compare('Test@123', foundUser.password);
            console.log('✅ Password validation test:', isPasswordValid ? 'Passed' : 'Failed');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n✅ Database connection closed');
    }
};

testConnection();