const axios = require('axios');

const BASE_URL = 'https://server-employee-directory-nestjs.vercel.app';

async function testCORS() {
  console.log('🔒 Testing CORS Configuration...\n');
  console.log(`Backend URL: ${BASE_URL}\n`);

  const testOrigins = [
    'http://localhost:3000',
    'https://client-employee-directory-next.vercel.app',
    'https://client-employee-dire-git-2c8494-zainnaeem-invozonedevs-projects.vercel.app',
    'https://client-employee-directory-next-q0tx3oh3j.vercel.app'
  ];

  for (const origin of testOrigins) {
    try {
      console.log(`Testing CORS for origin: ${origin}`);
      
      const response = await axios.get(`${BASE_URL}/api/v1/health`, {
        headers: {
          'Origin': origin,
          'User-Agent': 'CORS-Test/1.0'
        },
        timeout: 10000
      });

      const corsHeaders = response.headers;
      console.log(`✅ CORS Headers for ${origin}:`);
      console.log(`   Access-Control-Allow-Origin: ${corsHeaders['access-control-allow-origin'] || 'Not set'}`);
      console.log(`   Access-Control-Allow-Credentials: ${corsHeaders['access-control-allow-credentials'] || 'Not set'}`);
      console.log(`   Access-Control-Allow-Methods: ${corsHeaders['access-control-allow-methods'] || 'Not set'}`);
      console.log(`   Status: ${response.status}\n`);

    } catch (error) {
      if (error.response) {
        console.log(`❌ CORS Error for ${origin}: ${error.response.status} - ${error.response.statusText}`);
        console.log(`   CORS Headers: ${JSON.stringify(error.response.headers, null, 2)}\n`);
      } else {
        console.log(`❌ Network Error for ${origin}: ${error.message}\n`);
      }
    }
  }

  console.log('🎉 CORS test completed!');
  console.log('\n📝 Note: If you see CORS errors, make sure to deploy the updated backend configuration.');
}

testCORS().catch(console.error); 