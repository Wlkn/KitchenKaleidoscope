"use strict";
// Create and initialize a connection pool to the database
// using the environment variables defined in .env
const Pool = require("pg").Pool;
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    password: "password",
    database: "KitchenKaleidoscope",
    port: 5432,
});

module.exports = pool;
