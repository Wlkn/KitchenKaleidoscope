// Create and initialize a connection pool to the database
// using the environment variables defined in .env
const Pool = require("pg").Pool;

const pool = new Pool({
    connectionTimeoutMillis: 200000,
    idleTimeoutMillis: 300000,
    host: "dpg-cfe8j2pmbjsqnjlhiai0-a.ohio-postgres.render.com",
    user: "admin",
    password: "ABQjs9LlWAeGb9JIyz0W9yNkyhl7VZbl",
    database: "kitchenkaleidoscope", //KitchenKaleidoscope Database
    port: 5432,
    ssl: true,
});

pool.connect();

pool.on("error", (err, client) => {
    console.error("Unexpected error on idle client", err);
    process.exit(-1);
});

pool.on("connect", () => {
    console.log("Connected to the database successfully! - postGres.ts");
});


module.exports = pool;
