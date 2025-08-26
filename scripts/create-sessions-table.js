import { Pool } from '@neondatabase/serverless';
import ws from "ws";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createSessionsTable() {
  try {
    console.log('Creating sessions table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR NOT NULL COLLATE "default",
        sess JSON NOT NULL,
        expire TIMESTAMP(6) NOT NULL
      );
      
      ALTER TABLE sessions ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid) NOT DEFERRABLE INITIALLY IMMEDIATE;
      
      CREATE INDEX IF NOT EXISTS IDX_sessions_expire ON sessions (expire);
    `;
    
    await pool.query(createTableSQL);
    console.log('✅ Sessions table created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sessions table:', error.message);
  } finally {
    await pool.end();
  }
}

createSessionsTable();
