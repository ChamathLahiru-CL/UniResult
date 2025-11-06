/* eslint-disable no-undef */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const testPhoneUpdate = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find the test user
        const user = await User.findOne({ username: 'UWUICT22' });

        if (!user) {
            console.log('❌ User UWUICT22 not found');
            process.exit(1);
        }

        console.log('📋 Current User Data:');
        console.log('Username:', user.username);
        console.log('Email:', user.email);
        console.log('Name:', user.name);
        console.log('Current Phone:', user.phoneNumber || 'Not set');
        console.log('Profile Image:', user.profileImage ? 'Set' : 'Not set');
        console.log('\n' + '='.repeat(50) + '\n');

        // Update phone number
        const newPhoneNumber = '+94 77 987 6543';
        console.log('📞 Updating phone number to:', newPhoneNumber);
        
        user.phoneNumber = newPhoneNumber;
        await user.save();

        console.log('✅ Phone number updated successfully\n');

        // Verify the update
        const updatedUser = await User.findOne({ username: 'UWUICT22' });
        console.log('✅ Verification - Phone number in database:', updatedUser.phoneNumber);

        if (updatedUser.phoneNumber === newPhoneNumber) {
            console.log('✅ Phone number update verified successfully!');
        } else {
            console.log('❌ Phone number verification failed!');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

testPhoneUpdate();
