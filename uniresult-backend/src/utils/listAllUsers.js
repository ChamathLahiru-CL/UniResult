/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const listAllUsers = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all users
        const users = await User.find({});

        console.log('👥 TOTAL USERS IN DATABASE:', users.length);
        console.log('='.repeat(80));
        console.log('\n');

        if (users.length === 0) {
            console.log('❌ No users found in database');
        } else {
            users.forEach((user, index) => {
                console.log(`\n📋 USER ${index + 1}:`);
                console.log('─'.repeat(80));
                console.log('🆔 ID:', user._id);
                console.log('👤 Username:', user.username);
                console.log('📧 Email:', user.email);
                console.log('👨‍💼 Name:', user.name);
                console.log('🎭 Role:', user.role);
                console.log('📱 Phone:', user.phoneNumber || 'Not set');
                console.log('🖼️  Profile Image:', user.profileImage ? 'Set' : 'Not set');
                console.log('🎓 Enrollment Number:', user.enrollmentNumber || 'N/A');
                console.log('🏢 Department:', user.department || 'N/A');
                console.log('✅ Is Active:', user.isActive);
                console.log('✅ Is Verified:', user.isVerified);
                console.log('📅 Created:', user.createdAt);
                console.log('🕐 Last Login:', user.lastLogin || 'Never');
                console.log('🔑 Password Hash:', user.password ? user.password.substring(0, 30) + '...' : 'No password');
                
                // Test common passwords
                console.log('\n🔐 PASSWORD TESTS:');
                const testPasswords = ['123456', user.username, 'password', 'admin123', 'student123'];
                
                testPasswords.forEach(async (testPass) => {
                    const isMatch = await bcrypt.compare(testPass, user.password);
                    if (isMatch) {
                        console.log(`   ✅ PASSWORD FOUND: "${testPass}"`);
                    }
                });
                
                console.log('─'.repeat(80));
            });

            console.log('\n\n📊 SUMMARY:');
            console.log('='.repeat(80));
            const roleCount = users.reduce((acc, user) => {
                acc[user.role] = (acc[user.role] || 0) + 1;
                return acc;
            }, {});
            
            Object.entries(roleCount).forEach(([role, count]) => {
                console.log(`${role.toUpperCase()}: ${count} user(s)`);
            });
            
            console.log('\n📝 CREDENTIAL LIST FOR LOGIN:');
            console.log('='.repeat(80));
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. Username: ${user.username}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Test with passwords: 123456, ${user.username}, password`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

// Wait a bit for async password checks to complete
setTimeout(() => {
    listAllUsers();
}, 100);
