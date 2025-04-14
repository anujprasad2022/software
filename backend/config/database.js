const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER ,
    host: process.env.DB_HOST ,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

// Add error handler
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool; 