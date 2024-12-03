
/**
 * Database Connection Module
 * 
 * @author Alonso Peralta Espinoza
 *
 * @description
 * Configures and establishes a connection to the PostgreSQL database using environment variables.
 *
 * @features
 * - Reads connection details (host, port, user, password, database) from `.env` file.
 * - Exposes a `query` method for executing SQL queries against the database.
 *
 * @dependencies
 * - `dotenv`: Loads environment variables from a `.env` file into `process.env`.
 * - `pg`: Provides PostgreSQL client and connection pooling via `Pool`.
 *
 * @configuration
 * - `PGHOST`: Host address of the PostgreSQL server.
 * - `PGPORT`: Port number for the PostgreSQL server.
 * - `PGUSER`: Username for authentication.
 * - `PGPASSWORD`: Password for authentication.
 * - `PGDATABASE`: Name of the database to connect to.
 *
 * @usage
 * // Import the module
 * const db = require('./database');
 *
 * // Execute a query
 * db.query('SELECT * FROM users WHERE id = $1', [userId])
 *   .then(res => console.log(res.rows))
 *   .catch(err => console.error('Database query error:', err));
 *
 * @exports
 * - `query`: A function to execute SQL queries, accepting a query text and optional parameters.
 */


require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
});

// Set timezone for every connection
pool.on('connect', (client) => {
    client.query("SET TIMEZONE TO 'America/Chicago';")
        .catch((err) => console.error('Error setting timezone:', err));
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};

// To fetch data make a file inside api folder