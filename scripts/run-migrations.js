const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running database migrations...');

try {
  // Check if we're in production
  const isProduction = process.env.NODE_ENV === 'production';
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  console.log(`📊 Database URL: ${databaseUrl.substring(0, 20)}...`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Run TypeORM migrations
  const migrationCommand = `npx typeorm-ts-node-commonjs migration:run -d src/config/typeorm.config.ts`;
  
  console.log(`🔧 Executing: ${migrationCommand}`);
  execSync(migrationCommand, { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  
  console.log('✅ Migrations completed successfully!');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
} 