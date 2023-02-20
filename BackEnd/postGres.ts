// Create and initialize a connection pool to the database
// using the environment variables defined in .env
const Pool = require("pg").Pool;

const pool = new Pool({
    connectionTimeoutMillis: 200000,
    idleTimeoutMillis: 300000,
    host: process.env.POSTGRE_HOST_STRING,
    user: "admin",
    password: process.env.POSTGRE_PASSWORD,
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
