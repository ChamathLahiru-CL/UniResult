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

        // Delete existing admin users
        const deleted = await User.deleteMany({ 
            username: { $in: ['ADMIN2024', 'ADMIN2025'] } 
        });
        console.log('🗑️  Deleted existing admin users:', deleted.deletedCount);

        // Admin users data
        const adminUsers = [
            {
                username: 'ADMIN2024',
                email: 'admin@std.uwu.ac.lk',
                password: 'Admin@123',
                name: 'Admin User',
                role: 'admin',
                department: 'Administration'
            },
            {
                username: 'ADMIN2025',
                email: 'admin25@std.uwu.ac.lk',
                password: 'Admin@123',
                name: 'Janith Navoodya',
                role: 'admin',
                department: 'Administration'
            }
        ];

        console.log('🔐 Creating admin users...\n');

        // Create both admin users
        for (const adminData of adminUsers) {
            const hashedPassword = await bcrypt.hash(adminData.password, 10);
            
            const adminUser = await User.create({
                username: adminData.username,
                email: adminData.email,
                password: hashedPassword,
                name: adminData.name,
                role: adminData.role,
                department: adminData.department,
                isActive: true,
                isVerified: true,
                agreeTerms: true
            });

            console.log('✅ Admin user created successfully!');
            console.log('='.repeat(80));
            console.log('👤 Username:', adminUser.username);
            console.log('📧 Email:', adminUser.email);
            console.log('🎭 Role:', adminUser.role);
            console.log('👨‍💼 Name:', adminUser.name);
            console.log('🔑 Password:', adminData.password);
            console.log('='.repeat(80));

            // Test the password
            const isValid = await bcrypt.compare(adminData.password, adminUser.password);
            console.log('✅ Password verification:', isValid ? 'SUCCESS ✅' : 'FAILED ❌');

            // Try to find the user
            const foundUser = await User.findOne({ 
                username: adminUser.username, 
                role: 'admin' 
            });
            console.log('✅ User can be found in DB:', foundUser ? 'YES ✅' : 'NO ❌');
            console.log('\n');
        }

        // Summary
        console.log('\n' + '='.repeat(80));
        console.log('📋 ADMIN USERS SUMMARY');
        console.log('='.repeat(80));
        console.log('\n👤 Admin User 1:');
        console.log('   Username: ADMIN2024');
        console.log('   Password: Admin@123');
        console.log('   Name: Admin User');
        console.log('   Email: admin@std.uwu.ac.lk');
        console.log('\n👤 Admin User 2:');
        console.log('   Username: ADMIN2025');
        console.log('   Password: Admin@123');
        console.log('   Name: Janith Navoodya');
        console.log('   Email: admin25@std.uwu.ac.lk');
        console.log('\n' + '='.repeat(80));
        console.log('✅ Both admin users created successfully!');
        console.log('🎯 You can now login with either account');
        console.log('='.repeat(80));

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
