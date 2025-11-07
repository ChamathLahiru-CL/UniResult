/* eslint-disable no-undef */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Define User Schema inline
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin', 'examDiv'], default: 'student' },
    department: String,
    phoneNumber: String,
    profileImage: String,
    enrollmentNumber: String,
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    agreeTerms: { type: Boolean, default: false },
    lastLogin: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const createAdminUser = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        console.log('📍 URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Delete existing admin user
        const deleted = await User.deleteOne({ username: 'ADMIN2025' });
        console.log('🗑️  Deleted existing ADMIN2025:', deleted.deletedCount);

        // Create admin user with pre-hashed password
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        console.log('🔐 Password hashed successfully');

        const adminUser = await User.create({
            username: 'ADMIN2025',
            email: 'admin25@std.uwu.ac.lk',
            password: hashedPassword,
            name: 'Janith Navoodya',
            role: 'admin',
            department: 'Administration',
            isActive: true,
            isVerified: true,
            agreeTerms: true
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('='.repeat(80));
        console.log('👤 Username:', adminUser.username);
        console.log('📧 Email:', adminUser.email);
        console.log('🎭 Role:', adminUser.role);
        console.log('👨‍💼 Name:', adminUser.name);
        console.log('🔑 Password: Admin@123');
        console.log('='.repeat(80));

        // Test the password
        const isValid = await bcrypt.compare('Admin@123', adminUser.password);
        console.log('\n✅ Password verification:', isValid ? 'SUCCESS' : 'FAILED');

        // Try to find the user
        const foundUser = await User.findOne({ username: 'ADMIN2025', role: 'admin' });
        console.log('✅ User can be found:', foundUser ? 'YES' : 'NO');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

createAdminUser();
