const { Client } = require('pg');

async function testDatabaseSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Check if employees table exists
    const tableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'employees'
      );
    `;
    
    const tableExists = await client.query(tableQuery);
    console.log('📊 Employees table exists:', tableExists.rows[0].exists);

    if (tableExists.rows[0].exists) {
      // Check table structure
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'employees' 
        ORDER BY ordinal_position;
      `;
      
      const columns = await client.query(columnsQuery);
      console.log('\n📋 Table structure:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });

      // Check specifically for customAvatar
      const customAvatarExists = columns.rows.some(col => col.column_name === 'customavatar');
      console.log('\n🎯 customAvatar column exists:', customAvatarExists);

      if (!customAvatarExists) {
        console.log('⚠️  customAvatar column is missing! This is causing the 500 error.');
        console.log('💡 The app will automatically add this column on next deployment.');
      }
    }

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await client.end();
  }
}

// Run the test
testDatabaseSchema(); 