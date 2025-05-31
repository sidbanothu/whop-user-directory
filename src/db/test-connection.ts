import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';
import 'dotenv/config';

async function testConnection(connectionString: string, description: string) {
  try {
    // Redact the password for security
    const redactedUrl = connectionString.replace(/:([^:@]+)@/, ':****@');
    console.log(`\n🔍 Testing ${description} connection with:`, redactedUrl);
    
    const client = postgres(connectionString, {
      ssl: 'require',
      connect_timeout: 10,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
      prepare: true,
    });
    
    const db = drizzle(client);
    
    // Try to execute a simple query
    const result = await db.execute(sql`SELECT current_timestamp`);
    console.log(`✅ ${description} connection successful!`);
    console.log('Current timestamp:', result[0].current_timestamp);
    
    await client.end();
    
  } catch (error) {
    console.error(`❌ ${description} connection failed:`, error);
  }
}

async function runTests() {
  console.log('Environment variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('DIRECT_URL:', process.env.DIRECT_URL);
  console.log('DATABASE_URL_SERVICE_ROLE:', process.env.DATABASE_URL_SERVICE_ROLE);
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }
  
  if (!process.env.DATABASE_URL_SERVICE_ROLE) {
    console.error('❌ DATABASE_URL_SERVICE_ROLE is not set in .env file');
    process.exit(1);
  }
  
  await testConnection(process.env.DATABASE_URL, 'Regular');
  await testConnection(process.env.DATABASE_URL_SERVICE_ROLE, 'Service Role');
  
  process.exit(0);
}

runTests(); 