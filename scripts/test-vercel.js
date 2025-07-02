const axios = require('axios');

const BASE_URL = 'https://server-employee-directory-nestjs.vercel.app';

async function testVercelDeployment() {
  console.log('🚀 Testing Vercel Deployment...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  const endpoints = [
    { path: '/', name: 'Root' },
    { path: '/api/v1/health', name: 'Health Check' },
    { path: '/api/v1/employees', name: 'Employees' },
    { path: '/api/v1/employees/departments', name: 'Departments' },
    { path: '/api/v1/employees/titles', name: 'Titles' },
    { path: '/api/v1/employees/locations', name: 'Locations' },
    { path: '/api/docs', name: 'Swagger Docs' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name} (${endpoint.path})...`);
      const startTime = Date.now();
      const response = await axios.get(`${BASE_URL}${endpoint.path}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Vercel-Test/1.0'
        }
      });
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${endpoint.name}: ${response.status} (${duration}ms)`);
      
      if (endpoint.path === '/') {
        console.log(`   📄 Response: ${JSON.stringify(response.data, null, 2)}`);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint.name}: ${error.response.status} - ${error.response.statusText}`);
        if (error.response.status === 404) {
          console.log(`   💡 This might be expected for some endpoints`);
        }
      } else if (error.code === 'ECONNREFUSED') {
        console.log(`❌ ${endpoint.name}: Connection refused`);
      } else if (error.code === 'ETIMEDOUT') {
        console.log(`❌ ${endpoint.name}: Request timeout`);
      } else {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    }
    console.log('');
  }

  console.log('🎉 Vercel deployment test completed!');
}

testVercelDeployment().catch(console.error); 