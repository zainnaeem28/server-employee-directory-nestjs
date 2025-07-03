const { Client } = require('pg');

async function resetDatabase() {
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

    // Drop the existing employees table if it exists
    console.log('🗑️  Dropping existing employees table...');
    await client.query('DROP TABLE IF EXISTS employees CASCADE');
    console.log('✅ Dropped employees table');

    // Create the employees table with the correct schema
    console.log('🏗️  Creating employees table with correct schema...');
    await client.query(`
      CREATE TABLE employees (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        department VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        "customAvatar" VARCHAR(500),
        "hireDate" DATE NOT NULL,
        salary DECIMAL(10,2) NOT NULL,
        manager VARCHAR(100),
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created employees table');

    // Create indexes
    console.log('📊 Creating indexes...');
    await client.query('CREATE INDEX IDX_EMPLOYEES_DEPARTMENT ON employees(department)');
    await client.query('CREATE INDEX IDX_EMPLOYEES_EMAIL ON employees(email)');
    await client.query('CREATE INDEX IDX_EMPLOYEES_NAME ON employees("firstName", "lastName")');
    await client.query('CREATE INDEX IDX_EMPLOYEES_CREATED_AT ON employees("createdAt")');
    console.log('✅ Created indexes');

    // Insert some sample data
    console.log('📝 Inserting sample data...');
    await client.query(`
      INSERT INTO employees (
        "firstName", "lastName", email, phone, department, title, location, 
        "hireDate", salary, "isActive"
      ) VALUES 
      ('John', 'Doe', 'john.doe@company.com', '555-0101', 'Engineering', 'Software Engineer', 'New York', '2023-01-15', 75000.00, true),
      ('Jane', 'Smith', 'jane.smith@company.com', '555-0102', 'Marketing', 'Marketing Manager', 'Los Angeles', '2023-02-20', 65000.00, true),
      ('Bob', 'Johnson', 'bob.johnson@company.com', '555-0103', 'Sales', 'Sales Representative', 'Chicago', '2023-03-10', 55000.00, true)
    `);
    console.log('✅ Inserted sample data');

    // Verify the table structure
    console.log('\n📋 Final table structure:');
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'employees' 
      ORDER BY ordinal_position
    `);
    
    columns.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    console.log('\n🎉 Database reset completed successfully!');

  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the reset
resetDatabase(); 