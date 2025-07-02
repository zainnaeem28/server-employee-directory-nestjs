#!/usr/bin/env node

const axios = require('axios');
const { Client } = require('pg');

class DeploymentTester {
  constructor() {
    this.baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3001';
    this.results = [];
    this.isLocal = process.env.NODE_ENV === 'development';
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async testEnvironmentVariables() {
    this.log('Testing environment variables...');
    
    const requiredVars = this.isLocal ? [
      'NODE_ENV'
    ] : [
      'NODE_ENV',
      'DATABASE_URL',
      'JWT_SECRET',
      'ALLOWED_ORIGINS'
    ];

    const optionalVars = this.isLocal ? [
      'DATABASE_URL',
      'JWT_SECRET', 
      'ALLOWED_ORIGINS'
    ] : [];

    const results = [];

    // Check required variables
    for (const varName of requiredVars) {
      const value = process.env[varName];
      const exists = !!value;
      const isSecure = varName.includes('SECRET') || varName.includes('PASSWORD') || varName.includes('URL');
      
      this.log(`${varName}: ${exists ? '✅ Set' : '❌ Missing'}${isSecure && exists ? ' (value hidden)' : exists ? ` = ${value}` : ''}`);
      
      results.push({ variable: varName, exists, required: true, value: isSecure ? '[HIDDEN]' : value });
    }

    // Check optional variables for local
    for (const varName of optionalVars) {
      const value = process.env[varName];
      const exists = !!value;
      const isSecure = varName.includes('SECRET') || varName.includes('PASSWORD') || varName.includes('URL');
      
      this.log(`${varName}: ${exists ? '✅ Set' : '⚠️  Optional'}${isSecure && exists ? ' (value hidden)' : exists ? ` = ${value}` : ''}`);
      
      results.push({ variable: varName, exists, required: false, value: isSecure ? '[HIDDEN]' : value });
    }

    this.results.push({ test: 'Environment Variables', results });
    return results.filter(r => r.required).every(r => r.exists);
  }

  async testDatabaseConnection() {
    this.log('Testing database connection...');
    
    if (this.isLocal) {
      this.log('Skipping direct database connection test for local development', 'info');
      this.results.push({ test: 'Database Connection', success: true, skipped: true });
      return true;
    }
    
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        this.log('❌ DATABASE_URL not found', 'error');
        return false;
      }

      const client = new Client({
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false
        }
      });

      await client.connect();
      this.log('✅ Database connection successful', 'success');
      
      const result = await client.query('SELECT version()');
      this.log(`Database: ${result.rows[0].version.split(' ')[0]}`, 'info');
      
      await client.end();
      this.results.push({ test: 'Database Connection', success: true });
      return true;
    } catch (error) {
      this.log(`❌ Database connection failed: ${error.message}`, 'error');
      this.results.push({ test: 'Database Connection', success: false, error: error.message });
      return false;
    }
  }

  async testApiEndpoints() {
    this.log('Testing API endpoints...');
    
    const endpoints = [
      { path: '/api/v1/health', method: 'GET', name: 'Health Check' },
      { path: '/api/v1/employees', method: 'GET', name: 'Get Employees' },
      { path: '/api/v1/employees/departments', method: 'GET', name: 'Get Departments' },
      { path: '/api/v1/employees/titles', method: 'GET', name: 'Get Titles' },
      { path: '/api/v1/employees/locations', method: 'GET', name: 'Get Locations' },
      { path: '/api/docs', method: 'GET', name: 'Swagger Docs' }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const response = await axios({
          method: endpoint.method,
          url: `${this.baseUrl}${endpoint.path}`,
          timeout: 10000,
          validateStatus: () => true
        });
        const responseTime = Date.now() - startTime;

        const success = response.status < 400;
        const status = response.status;
        
        this.log(`${endpoint.name}: ${success ? '✅' : '❌'} ${status} (${responseTime}ms)`, success ? 'success' : 'error');
        
        results.push({
          endpoint: endpoint.name,
          path: endpoint.path,
          method: endpoint.method,
          status,
          responseTime,
          success
        });
      } catch (error) {
        this.log(`${endpoint.name}: ❌ ${error.message}`, 'error');
        results.push({
          endpoint: endpoint.name,
          path: endpoint.path,
          method: endpoint.method,
          error: error.message,
          success: false
        });
      }
    }

    this.results.push({ test: 'API Endpoints', results });
    return results.every(r => r.success);
  }

  async testDatabaseType() {
    this.log('Testing database type detection...');
    
    try {
      const response = await axios.get(`${this.baseUrl}/api/v1/health`);
      const dbInfo = response.data.database;
      
      if (dbInfo) {
        this.log(`✅ Database type: ${dbInfo.type}`, 'success');
        this.log(`Database host: ${dbInfo.host || 'N/A'}`, 'info');
        this.log(`Database name: ${dbInfo.database || 'N/A'}`, 'info');
        this.log(`Database status: ${dbInfo.status}`, 'info');
        this.results.push({ test: 'Database Type', success: true, info: dbInfo });
        return true;
      } else {
        this.log('❌ Database info not available in health endpoint', 'error');
        this.results.push({ test: 'Database Type', success: false });
        return false;
      }
    } catch (error) {
      this.log(`❌ Failed to get database info: ${error.message}`, 'error');
      this.results.push({ test: 'Database Type', success: false, error: error.message });
      return false;
    }
  }

  async runAllTests() {
    this.log('🚀 Starting deployment tests...', 'info');
    this.log(`Base URL: ${this.baseUrl}`, 'info');
    this.log(`Environment: ${process.env.NODE_ENV || 'development'}`, 'info');
    this.log(`Mode: ${this.isLocal ? 'Local Development' : 'Production'}`, 'info');
    
    const tests = [
      this.testEnvironmentVariables(),
      this.testDatabaseConnection(),
      this.testApiEndpoints(),
      this.testDatabaseType()
    ];

    const results = await Promise.all(tests);
    const allPassed = results.every(r => r);

    this.log('', 'info');
    this.log('📊 Test Summary:', 'info');
    this.log(`Overall Status: ${allPassed ? '✅ All tests passed' : '❌ Some tests failed'}`, allPassed ? 'success' : 'error');
    
    this.results.forEach(result => {
      const status = result.success !== undefined ? (result.success ? '✅' : '❌') : 'ℹ️';
      const skipped = result.skipped ? ' (skipped)' : '';
      this.log(`${status} ${result.test}${skipped}`, result.success !== undefined ? (result.success ? 'success' : 'error') : 'info');
    });

    return allPassed;
  }
}

async function main() {
  const tester = new DeploymentTester();
  const success = await tester.runAllTests();
  
  if (!success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = DeploymentTester; 