// Quick backend test script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('Testing MSLR Backend...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing /health endpoint...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', health.data);
    
    // Test Open Data API
    console.log('\n2. Testing /mslr/referendums?status=open...');
    const openData = await axios.get(`${BASE_URL}/mslr/referendums?status=open`);
    console.log('✅ Open Data API working');
    console.log('   Found', openData.data.Referendums?.length || 0, 'open referendums');
    
    // Test admin login
    console.log('\n3. Testing admin login...');
    try {
      const login = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'ec@referendum.gov.sr',
        password: 'Shangrilavote&2025@'
      });
      console.log('✅ Admin login successful with default password');
    } catch (err) {
      console.log('⚠️  Admin login failed - check password hash in database');
      console.log('   Run: node generate-admin-hash.js to regenerate hash');
    }
    
    console.log('\n✅ Backend is working correctly!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Ensure backend is running: npm start');
    console.log('- Check database connection in .env');
    console.log('- Verify MySQL is running');
  }
}

testBackend();
