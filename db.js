// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',     // Your PostgreSQL username
    host: 'localhost',    // Database host
    database: 'ElderlyMonitoring',  // The database name
    password: 'laiba',  // Your PostgreSQL password
    port: 5432,           // Default PostgreSQL port
});

module.exports = pool;
