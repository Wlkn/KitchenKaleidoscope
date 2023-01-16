import express = require("express");
const router = express.Router();
const pool = require("../postGres");

router.post("/", (req, res) => {
    console.log(req.body); //TODO REMOVE THIS WHEN DONE
    pool.query(
        "SELECT to_regclass('ingredients')",

        (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            if (!results.rows[0].to_regclass) {
                createTables();
            }

            const { recipe_id, quantity, ingredient_id, unit_id } = req.body;
            pool.query(
                "INSERT INTO ingredients (recipe_id, quantity, ingredient_id, unit_id) VALUES ($1, $2, $3, $4) RETURNING *",
                [recipe_id, quantity, ingredient_id, unit_id],
                (error: Error, results: any) => {
                    if (error) {
                        throw error;
                    }
                    res.status(201).send(
                        `Ingredient added with ID: ${results.rows[0].id}`
                    );
                    console.log(
                        `Ingredient added with ID: ${results.rows[0].id}`
                    ); //TODO REMOVE THIS WHEN DONE
                }
            );
        }
    );
});

router.get("/", (req, res) => {
    pool.query("SELECT * FROM ingredients", (error: Error, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});





function createTables() {
    pool.query(
        `CREATE TABLE ingredients (
                id SERIAL PRIMARY KEY,
                recipe_id CHAR(24),
                quantity NUMERIC,
                ingredient_id INTEGER REFERENCES ingredient_names(id),
                unit_id INTEGER REFERENCES units(id)
                );`,
        (error: Error) => {
            if (error) {
                throw error;
            }
            console.log("ingredients table created");
        }
    );
}

module.exports = router;
