import mongoose from 'mongoose';
import User from '../models/User.js';
import config from '../config/config.js';

const testUsers = [
    {
        username: 'ST2024001',
        password: 'Test@123',
        role: 'student',
        email: 'student@test.com',
        name: 'Test Student',
        department: 'Computer Science'
    },
    {
        username: 'ADMIN2024',
        password: 'Admin@123',
        role: 'admin',
        email: 'admin@test.com',
        name: 'Test Admin',
        department: 'Administration'
    },
    {
        username: 'EXAM2024',
        password: 'Exam@123',
        role: 'examDiv',
        email: 'exam@test.com',
        name: 'Test Exam Officer',
        department: 'Examination Division'
    }
];

const createTestUsers = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing test users
        const deleteResult = await User.deleteMany({
            username: { $in: testUsers.map(user => user.username) }
        });
        console.log('Deleted existing users:', deleteResult);

        // Create new test users (passwords will be hashed by the User model's pre-save hook)
        const createdUsers = await User.create(testUsers);
        
        console.log('\nTest users created successfully:');
        createdUsers.forEach(user => {
            console.log(`
----------------------------------------
Username: ${user.username}
Role: ${user.role}
Name: ${user.name}
Email: ${user.email}
Password (unhashed): ${testUsers.find(u => u.username === user.username).password}
----------------------------------------
            `);
        });

        // Verify users can be found
        for (const testUser of testUsers) {
            const foundUser = await User.findOne({ 
                username: testUser.username,
                role: testUser.role 
            });
            console.log(`\nVerifying user ${testUser.username}:`, 
                foundUser ? 'Found ✅' : 'Not found ❌'
            );
        }

    } catch (error) {
        console.error('Error creating test users:', error);
        console.error('Full error:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
};

createTestUsers();