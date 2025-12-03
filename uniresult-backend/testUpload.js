// Test timetable upload
import fetch from 'node-fetch';
import fs from 'fs';

const API_BASE = 'http://localhost:5000/api';

// Test login and upload
async function testUpload() {
  try {
    console.log('🧪 Testing Timetable Upload...\n');

    // 1. Login as exam division user
    console.log('1. Logging in as exam division user...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'EXAM2024',
        password: 'Exam@123'
      })
    });

    if (!loginResponse.ok) {
      const error = await loginResponse.text();
      console.log('❌ Login failed:', error);
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // 2. Test upload (create a dummy file for testing)
    console.log('2. Testing file upload...');

    // Create a simple test file
    const testContent = 'Test PDF content';
    fs.writeFileSync('./test-upload.pdf', testContent);

    const formData = new FormData();
    formData.append('file', fs.createReadStream('./test-upload.pdf'), 'test.pdf');
    formData.append('faculty', 'Technological Studies');
    formData.append('year', '1st Year');

    const uploadResponse = await fetch(`${API_BASE}/timetable/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.log('❌ Upload failed:', error);
      return;
    }

    const uploadData = await uploadResponse.json();
    console.log('✅ Upload successful:', uploadData);

    // Clean up
    fs.unlinkSync('./test-upload.pdf');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUpload();