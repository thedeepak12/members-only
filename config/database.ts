import { Pool } from 'pg';
import { readFileSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(client => {
    console.log('DB Connected');
    client.release();
  })
  .catch(err => console.error('DB Connection Error:', err.stack));

const initializeDatabase = async () => {
  const client = await pool.connect();
  
  try {
    const schemaPath = path.join(process.cwd(), 'db', 'schema.sql');
    const sql = readFileSync(schemaPath, 'utf8');
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('Tables created successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err);
    throw err;
  } finally {
    client.release();
  }
};

initializeDatabase().catch(console.error);

export default pool;
