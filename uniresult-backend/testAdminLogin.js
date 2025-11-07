// Test script to check admin login
const testAdminLogin = async () => {
    try {
        console.log('🔐 Testing Admin Login...\n');
        
        const response = await fetch('http://localhost:5000/api/auth/login', {
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

        const data = await response.json();
        
        console.log('📡 Response Status:', response.status);
        console.log('📦 Response Data:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\n✅ Login Successful!');
            console.log('Token:', data.data?.token?.substring(0, 30) + '...');
        } else {
            console.log('\n❌ Login Failed!');
            console.log('Error:', data.message);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

testAdminLogin();
