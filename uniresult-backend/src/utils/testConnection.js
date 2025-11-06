async function testConnection() {
    try {
        // Test server health
        const healthResponse = await fetch('http://localhost:5000/api/health');
        const healthData = await healthResponse.json();
        console.log('Server Health Check:', healthData);

        // Test login with student credentials
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'ST2024001',
                password: 'Test@123',
                role: 'student'
            })
        });
        const loginData = await loginResponse.json();
        console.log('Login Test:', loginData);

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testConnection();