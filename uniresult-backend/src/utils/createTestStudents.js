/* eslint-disable no-undef */
import mongoose from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createTestStudents = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Test students data
        const testStudents = [
            {
                username: 'EN20241001',
                enrollmentNumber: 'EN20241001',
                email: 'john.doe@std.uwu.ac.lk',
                password: 'student123',
                name: 'John Doe',
                role: 'student',
                department: 'ICT',
                faculty: 'ICT',
                program: 'BSc in Computer Science',
                degree: 'BSc',
                year: 2,
                matricNumber: 'CS2024001',
                agreeTerms: true,
                isActive: true,
                isVerified: true
            },
            {
                username: 'EN20231002',
                enrollmentNumber: 'EN20231002',
                email: 'jane.smith@std.uwu.ac.lk',
                password: 'student123',
                name: 'Jane Smith',
                role: 'student',
                department: 'ENM',
                faculty: 'ENM',
                program: 'BBA in Marketing',
                degree: 'BBA',
                year: 3,
                matricNumber: 'BA2023002',
                agreeTerms: true,
                isActive: true,
                isVerified: true
            },
            {
                username: 'EN20251003',
                enrollmentNumber: 'EN20251003',
                email: 'alex.johnson@std.uwu.ac.lk',
                password: 'student123',
                name: 'Alex Johnson',
                role: 'student',
                department: 'ICT',
                faculty: 'ICT',
                program: 'BSc in IT',
                degree: 'BSc',
                year: 1,
                matricNumber: 'IT2025003',
                agreeTerms: true,
                isActive: false, // Suspended student
                isVerified: true
            }
        ];

        console.log('🎓 Creating test students...\n');

        for (const studentData of testStudents) {
            const hashedPassword = await bcrypt.hash(studentData.password, 10);

            const student = await User.create({
                ...studentData,
                password: hashedPassword
            });

            console.log('✅ Student created successfully!');
            console.log('👤 Name:', student.name);
            console.log('📧 Email:', student.email);
            console.log('🎓 Department:', student.department);
            console.log('📚 Program:', student.program);
            console.log('📅 Year:', student.year);
            console.log('🆔 Matric:', student.matricNumber);
            console.log('📊 Status:', student.isActive ? 'Active' : 'Suspended');
            console.log('🔑 Password: student123');
            console.log('-'.repeat(50));
        }

        console.log('\n✅ All test students created successfully!');
        console.log('🎯 You can now test the student management features');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Disconnected from MongoDB');
    }
};

createTestStudents();