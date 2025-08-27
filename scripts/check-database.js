import { Pool } from '@neondatabase/serverless';
import ws from "ws";
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

async function checkDatabase() {
  console.log('🔍 Checking database connection...');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.log('📝 Please set DATABASE_URL in your Render environment variables.');
    console.log('🔗 Go to: https://dashboard.render.com > Your Service > Environment');
    console.log('📋 Add: DATABASE_URL=postgresql://postgres:newnew@db.bfaaznkamabozpiyjych.supabase.co:5432/postgres');
    return;
  }
  
  console.log('✅ DATABASE_URL is set');
  console.log('🔗 Database URL:', databaseUrl.replace(/:[^:@]*@/, ':****@')); // Hide password
  
  try {
    const pool = new Pool({ connectionString: databaseUrl });
    
    console.log('🔄 Testing connection...');
    const client = await pool.connect();
    
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('⏰ Database time:', result.rows[0].current_time);
    
    client.release();
    await pool.end();
    
    console.log('🎉 Database is ready for use!');
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'ENETUNREACH') {
      console.log('💡 This looks like a network connectivity issue.');
      console.log('🔧 Possible solutions:');
      console.log('   1. Check if your Supabase database is active');
      console.log('   2. Verify the DATABASE_URL is correct');
      console.log('   3. Check if your Supabase project allows external connections');
    }
  }
}

checkDatabase().catch(console.error);
