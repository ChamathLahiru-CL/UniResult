// Test script for TimeTable API
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

// Test data
const testUser = {
  username: 'examdiv1',
  password: 'password123'
};

async function testTimeTableAPI() {
  try {
    console.log('🧪 Testing TimeTable API...\n');

    // 1. Login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed. Please ensure test user exists.');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // 2. Test GET timetables
    console.log('2. Testing GET /timetable...');
    const getResponse = await fetch(`${API_BASE}/timetable`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log(`✅ GET successful. Found ${getData.data.length} timetables\n`);
    } else {
      console.log('❌ GET failed\n');
    }

    // 3. Test file upload (you would need to provide actual file)
    console.log('3. File upload test skipped (requires actual file)\n');

    console.log('🎉 API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTimeTableAPI();