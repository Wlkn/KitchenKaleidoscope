// Create and initialize a connection pool to the database
// using the environment variables defined in .env
const Pool = require("pg").Pool;

const pool = new Pool({
    host: process.env.POSTGRE_HOST_STRING2,
    user: process.env.POSTGRE_USER2,
    password: process.env.POSTGRE_PASSWORD2,
    database: process.env.POSTGRE_DATABASE2 ,
    port: 5432,
    ssl: true
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
