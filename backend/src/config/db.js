const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL, 
        ssl: { rejectUnauthorized: false } 
      }
    : {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
    };

const pool = new Pool(poolConfig);

// Test the connection
pool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL Database successfully!'))
    .catch((err) => console.error('❌ Database connection error:', err.stack));

module.exports = pool;