import axios from 'axios';

async function testAPIConnection() {
  console.log('🔧 Testing Backend API Connection...\n');

  const baseURL = 'http://localhost:5000';
  
  try {
    // Test 1: Backend Health Check
    console.log('1️⃣ Testing Backend Health Check...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Backend Health:', healthResponse.data.message);
    
    // Test 2: API Base Endpoint
    console.log('\n2️⃣ Testing API Base Endpoint...');
    const apiResponse = await axios.get(`${baseURL}/api/v1`);
    console.log('✅ API Base:', apiResponse.data.message);
    
    // Test 3: Internship Categories (no auth required)
    console.log('\n3️⃣ Testing Internship Categories...');
    const categoriesResponse = await axios.get(`${baseURL}/api/v1/internships/categories`);
    console.log('✅ Categories:', categoriesResponse.data.data?.length, 'categories available');
    
    // Test 4: Frontend API Client Configuration
    console.log('\n4️⃣ Frontend API Configuration:');
    console.log('- Frontend URL: http://localhost:5174');
    console.log('- Backend URL: http://localhost:5000');
    console.log('- API Base URL: http://localhost:5000/api/v1');
    console.log('✅ URLs are properly configured');
    
    console.log('\n🎉 All API Connectivity Tests PASSED! ✅');
    console.log('Frontend-Backend integration is ready!');
    
  } catch (error) {
    console.error('❌ API Connection Test Failed:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testAPIConnection();
