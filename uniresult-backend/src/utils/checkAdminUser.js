/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const checkAdminUser = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find admin user
        const admin = await User.findOne({ username: 'ADMIN2024' }).select('+password');

        if (!admin) {
            console.log('❌ Admin user ADMIN2024 not found in database!');
            console.log('\n📋 All users in database:');
            const allUsers = await User.find({});
            allUsers.forEach(user => {
                console.log(`- ${user.username} (${user.role})`);
            });
            process.exit(1);
        }

        console.log('✅ Admin user found!');
        console.log('='.repeat(80));
        console.log('👤 Username:', admin.username);
        console.log('📧 Email:', admin.email);
        console.log('👨‍💼 Name:', admin.name);
        console.log('🎭 Role:', admin.role);
        console.log('🔑 Password Hash:', admin.password ? admin.password.substring(0, 30) + '...' : 'NO PASSWORD');
        console.log('✅ Is Active:', admin.isActive);
        console.log('📅 Created:', admin.createdAt);
        console.log('='.repeat(80));

        // Test passwords
        console.log('\n🔐 Testing passwords:');
        const testPasswords = ['Admin@123', 'admin@123', 'Admin123', '123456', 'ADMIN2024'];
        
        for (const testPass of testPasswords) {
            const isMatch = await bcrypt.compare(testPass, admin.password);
            console.log(`   ${testPass}: ${isMatch ? '✅ CORRECT' : '❌ Wrong'}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

checkAdminUser();
