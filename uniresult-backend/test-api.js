import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test login as admin
async function testAdminLogin() {
    try {
        console.log('🔐 Testing admin login...');

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'ADMIN2024',
                password: 'Admin@123',
                role: 'admin'
            })
        });

        const result = await response.json();
        console.log('Login response:', result);

        if (result.success) {
            console.log('✅ Admin login successful!');
            console.log('🎫 Token received');
            return result.data.token;
        } else {
            console.log('❌ Admin login failed:', result.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Login error:', error.message);
        return null;
    }
}

// Test get all students
async function testGetStudents(token) {
    try {
        console.log('\n📚 Testing get all students...');

        const response = await fetch(`${API_BASE}/users/students`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Students fetched successfully!');
            console.log(`👥 Found ${result.data.length} students`);
            result.data.forEach(student => {
                console.log(`  - ${student.name} (${student.email}) - ${student.status}`);
            });
            return result.data;
        } else {
            console.log('❌ Failed to fetch students:', result.message);
            return [];
        }
    } catch (error) {
        console.error('❌ Fetch students error:', error.message);
        return [];
    }
}

// Test suspend student
async function testSuspendStudent(token, studentId) {
    try {
        console.log(`\n🚫 Testing suspend student ${studentId}...`);

        const response = await fetch(`${API_BASE}/users/${studentId}/suspend`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason: 'Testing suspension' })
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Student suspended successfully!');
            return true;
        } else {
            console.log('❌ Failed to suspend student:', result.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Suspend student error:', error.message);
        return false;
    }
}

// Test activate student
async function testActivateStudent(token, studentId) {
    try {
        console.log(`\n✅ Testing activate student ${studentId}...`);

        const response = await fetch(`${API_BASE}/users/${studentId}/activate`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Student activated successfully!');
            return true;
        } else {
            console.log('❌ Failed to activate student:', result.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Activate student error:', error.message);
        return false;
    }
}

// Main test function
async function runTests() {
    console.log('🧪 Starting API Tests for Student Management\n');

    // Test admin login
    const token = await testAdminLogin();
    if (!token) {
        console.log('❌ Cannot proceed without admin token');
        return;
    }

    // Test get students
    const students = await testGetStudents(token);
    if (students.length === 0) {
        console.log('❌ No students found to test with');
        return;
    }

    // Test suspend/activate with first student
    const testStudent = students[0];
    console.log(`\n🎯 Testing with student: ${testStudent.name} (ID: ${testStudent.id})`);

    // Suspend student
    await testSuspendStudent(token, testStudent.id);

    // Activate student
    await testActivateStudent(token, testStudent.id);

    console.log('\n🎉 All tests completed!');
}

// Run the tests
runTests().catch(console.error);