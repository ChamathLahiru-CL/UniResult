import fetch from 'node-fetch';

const testRegistration = async () => {
    const testUser = {
        fullName: "John Doe",
        email: "johndoe@std.uwu.ac.lk",
        enrollmentNumber: "ST2024999",
        password: "Test@123456",
        confirmPassword: "Test@123456",
        agreeTerms: true
    };

    try {
        console.log('\n🧪 Testing registration endpoint...\n');
        console.log('Test user data:', {
            fullName: testUser.fullName,
            email: testUser.email,
            enrollmentNumber: testUser.enrollmentNumber,
            agreeTerms: testUser.agreeTerms
        });

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });

        const data = await response.json();

        console.log('\n📊 Response Status:', response.status);
        console.log('📦 Response Data:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ Registration test PASSED!');
        } else {
            console.log('\n❌ Registration test FAILED!');
        }

    } catch (error) {
        console.error('\n❌ Test error:', error.message);
    }
};

testRegistration();
