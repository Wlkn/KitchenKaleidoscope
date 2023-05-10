import express = require("express");
const router = express.Router();
const pool = require("../postGres");
router.post("/", (req, res) => {
    // console.log(req.body);
    pool.query(
        "SELECT to_regclass('ingredients')",
        async (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            if (req.body.ingredientsList !== undefined) {
                for (let i = 0; i < req.body.ingredientsList.length; i++) {
                    let ingredientId = req.body.ingredientsList[i].ingredientId;
                    let unitId = req.body.ingredientsList[i].unitId;
                    let quantity = req.body.ingredientsList[i].quantity;
                    let newIngredient =
                        req.body.ingredientsList[i].newIngredient;
                    let newUnit = req.body.ingredientsList[i].newUnit;

                    if (unitId === -1) {
                        unitId = await addNewUnit(newUnit);
                    }
                    if (ingredientId === -1) {
                        ingredientId = await addNewIngredient(newIngredient);
                    }
                    pool.query(
                        "INSERT INTO ingredients (recipe_id, ingredient_id, unit_id, quantity) VALUES ($1, $2, $3, $4)",
                        [req.body.recipeId, ingredientId, unitId, quantity],
                        (error: Error, results: any) => {
                            if (error) {
                                console.log(
                                    "Error adding ingredients." + error
                                );
                                throw error;
                            }
                            // console.log("Ingredients added to recipe.");
                        }
                    );
                }
            }
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

router.get("/:id", (req, res) => {
    const id = req.params.id;
    pool.query(
        "SELECT * FROM ingredients WHERE recipe_id = $1",
        [id],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    );
});

router.delete("/", (req, res) => {
    pool.query("DELETE FROM ingredients", (error: Error, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`All ingredients deleted`);
    });
});

async function addNewIngredient(newIngredient) {
    try {
        const { rows } = await pool.query(
            "INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *",
            [newIngredient]
        );
        const newIngredientId = rows[0].id;
        // console.log(`new Ingredient added with ID: ${newIngredientId}`);
        return newIngredientId;
    } catch (error) {
        console.error("error adding new ingredient." + error);
        throw error;
    }
}

async function addNewUnit(newUnit) {
    try {
        const { rows } = await pool.query(
            "INSERT INTO units (name) VALUES ($1) RETURNING *",
            [newUnit]
        );
        const newUnitId = rows[0].id;
        // console.log(`new Unit added with ID: ${newUnitId}`);
        return newUnitId;
    } catch (error) {
        console.error("Error adding new unit." + error);
        throw error;
    }
}

module.exports = router;
