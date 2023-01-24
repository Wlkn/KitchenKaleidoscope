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
            //todo newingredient logic
            //done
            if (req.body.ingredientList.newIngredient != '') {
                try {
                    newIngredient(req); //new function
                } catch (error) {
                    console.log(error);
                }
            }
            //todo newunit logic
            //done
            if (req.body.newUnit != '') {
                try {
                    newUnit(req); //new function
                } catch (error) {
                    console.log(error);
                }
            }

            const { recipe_id, quantity, ingredient_id, unit_id } = req.body;
            if (
                req.body.recipe_id === undefined ||
                req.body.quantity === 0 ||
                undefined ||
                req.body.ingredient_id === undefined ||
                req.body.unit_id === undefined
            ) {
                res.status(400).send("Bad request, missing parameters.");
                console.log("Bad request, missing parameters. ingredients"); //TODO REMOVE THIS WHEN DONE
                return;
            }
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

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(
        "DELETE FROM ingredients WHERE id = $1",
        [id],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Ingredient deleted with ID: ${id}`);
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

function newIngredient(req) {
    pool.query(
        "INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *",
        [req.body.newIngredient],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            req.body.ingredient_id = results.rows[0].id;
            console.log(`Ingredient added with ID: ${results.rows[0].id}`);
            //TODO REMOVE THIS WHEN DONE
        }
    );
}

function newUnit(req) {
    pool.query(
        "INSERT INTO units (name) VALUES ($1) RETURNING *",
        [req.body.newUnit],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            req.body.unit_id = results.rows[0].id;
            console.log(`Unit added with ID: ${results.rows[0].id}`);
            //TODO REMOVE THIS WHEN DONE
        }
    );
}

module.exports = router;
