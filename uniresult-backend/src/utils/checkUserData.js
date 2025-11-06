import mongoose from 'mongoose';
import User from '../models/User.js';
import config from '../config/config.js';

const checkUserData = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find a user to check their data
        const user = await User.findOne({ username: 'UWUICT22' });
        
        if (user) {
            console.log('👤 User Found:');
            console.log('=====================================');
            console.log('Username:', user.username);
            console.log('Enrollment Number:', user.enrollmentNumber);
            console.log('Email:', user.email);
            console.log('Name:', user.name);
            console.log('Role:', user.role);
            console.log('Phone Number:', user.phoneNumber);
            console.log('Profile Image:', user.profileImage ? 'Has image' : 'No image');
            console.log('Department:', user.department);
            console.log('Created At:', user.createdAt);
            console.log('=====================================\n');

            // Test the name split
            const nameParts = user.name.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            console.log('📝 Name Split Test:');
            console.log('First Name:', firstName);
            console.log('Last Name:', lastName);
        } else {
            console.log('❌ No user found with username: UWUICT22');
            console.log('\n📋 All users in database:');
            const allUsers = await User.find({}).select('username email name role');
            allUsers.forEach(u => {
                console.log(`- ${u.username} (${u.role}): ${u.name} - ${u.email}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    }
};

checkUserData();
