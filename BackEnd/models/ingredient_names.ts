import express = require("express");
const router = express.Router();
const pool = require("../postGres");

router.post("/", (req, res) => {
    console.log(req.body); //TODO REMOVE THIS WHEN DONE
    pool.query(
        "SELECT to_regclass('ingredient')",

        (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            if (!results.rows[0].to_regclass) {
                createTables();
            }

            const { name } = req.body;
            pool.query(
                "INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *",
                [name],
                (error: Error, results: any) => {
                    if (error) {
                        throw error;
                    }
                    res.status(201).send(
                        `Ingredient added with ID: ${results.rows[0].id}`
                    );
                    console.log(
                        `Ingredient added with ID: ${results.rows[0].id}`
                    );
                    //TODO REMOVE THIS WHEN DONE
                }
            );
        }
    );
});

function createTables() {
    pool.query(
        `CREATE TABLE ingredient_names (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL
                );`,
        (error: Error) => {
            if (error) {
                throw error;
            }
            console.log("ingredient_names table created");
        }
    );
}

module.exports = router;