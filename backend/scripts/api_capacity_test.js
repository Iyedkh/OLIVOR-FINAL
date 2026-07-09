import http from 'http';
import { performance } from 'perf_hooks';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const ENDPOINTS = [
  { name: 'Root Endpoint', path: '/' },
  { name: 'Get Products', path: '/api/products' },
  { name: 'Get Categories', path: '/api/categories' },
  { name: 'Get Recipes', path: '/api/recipes' }
];

// Helper to make a single HTTP request and return stats
const makeRequest = (path) => {
  return new Promise((resolve) => {
    const start = performance.now();
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'OlivOr-Capacity-Tester/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = performance.now() - start;
        resolve({
          statusCode: res.statusCode,
          duration,
          success: res.statusCode === 200,
          rateLimited: res.statusCode === 429
        });
      });
    });

    req.on('error', (err) => {
      const duration = performance.now() - start;
      resolve({
        statusCode: 500,
        duration,
        success: false,
        rateLimited: false,
        error: err.message
      });
    });

    req.end();
  });
};

// Run a batch of concurrent requests
const runBatch = async (path, count) => {
  const promises = Array.from({ length: count }, () => makeRequest(path));
  return Promise.all(promises);
};

// Main test execution
const runLoadTest = async () => {
  console.log('==================================================');
  console.log('         OLIV\'OR API CAPACITY LOAD TEST           ');
  console.log('==================================================');
  console.log(`Target URL: ${BASE_URL}`);
  console.log(`Time: ${new Date().toLocaleString()}`);
  console.log('==================================================\n');

  // Verify server is running first
  try {
    const check = await makeRequest('/');
    if (check.statusCode !== 200 && check.statusCode !== 404) {
      throw new Error(`Server returned status code ${check.statusCode}`);
    }
  } catch (err) {
    console.error('CRITICAL ERROR: Could not connect to local server.');
    console.error('Please ensure the backend server is running (npm run dev) on port 5000.\n');
    process.exit(1);
  }

  // Load configuration
  const CONCURRENCY_STEPS = [10, 50, 100, 200];
  
  for (const endpoint of ENDPOINTS) {
    console.log(`Testing Endpoint: ${endpoint.name} (${endpoint.path})`);
    console.log('--------------------------------------------------');
    
    for (const concurrency of CONCURRENCY_STEPS) {
      process.stdout.write(`  Concurrency: ${concurrency.toString().padEnd(4)} requests... `);
      
      const startTest = performance.now();
      const results = await runBatch(endpoint.path, concurrency);
      const totalTime = performance.now() - startTest;
      
      let successCount = 0;
      let limitCount = 0;
      let failCount = 0;
      let totalDuration = 0;
      let minDuration = Infinity;
      let maxDuration = -Infinity;

      results.forEach((res) => {
        totalDuration += res.duration;
        if (res.success) successCount++;
        else if (res.rateLimited) limitCount++;
        else failCount++;

        if (res.duration < minDuration) minDuration = res.duration;
        if (res.duration > maxDuration) maxDuration = res.duration;
      });

      const avgDuration = totalDuration / concurrency;
      const rps = (concurrency / (totalTime / 1000)).toFixed(2);
      
      console.log(`Done`);
      console.log(`    - Success Rate : ${((successCount / concurrency) * 100).toFixed(1)}% (${successCount}/${concurrency})`);
      if (limitCount > 0) {
        console.log(`    - Rate Limited : ${((limitCount / concurrency) * 100).toFixed(1)}% (${limitCount}/${concurrency}) [HTTP 429]`);
      }
      if (failCount > 0) {
        console.log(`    - Failed       : ${((failCount / concurrency) * 100).toFixed(1)}% (${failCount}/${concurrency})`);
      }
      console.log(`    - Latency      : Avg: ${avgDuration.toFixed(1)}ms | Min: ${minDuration.toFixed(1)}ms | Max: ${maxDuration.toFixed(1)}ms`);
      console.log(`    - Throughput   : ${rps} requests/second`);
      console.log('');
    }
    console.log('--------------------------------------------------\n');
  }

  console.log('==================================================');
  console.log('             CAPACITY TEST COMPLETE               ');
  console.log('==================================================');
};

runLoadTest();
