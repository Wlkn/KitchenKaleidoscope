import express = require("express");
const router = express.Router();
const pool = require("../postGres");
router.post("/", (req, res) => {
    console.log(req.body);
    pool.query(
        "SELECT to_regclass('ingredients')",
        async (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            if (req.body !== undefined) {
                // for (let i = 0; i < req.body.length; i++) {
                let ingredientId = req.body.ingredientId;
                let unitId = req.body.unitId;
                let quantity = req.body.quantity;
                let newIngredient = req.body.newIngredient;
                let newUnit = req.body.newUnit;
                //todo change back to req.body.ingredientId and [i]
                // if unitId = -1 then its a completly new unit, we know this because the unitId is set to -1 in the front end
                if (unitId === -1) {
                    unitId = await addNewUnit(newUnit);
                    //make the unitId the id of the new unit
                    //  getUnitId(newUnit);
                }

                //if ingredientId = '' then its a completly new ingredient, we know this because the ingredientId is set to '' in the front end
                if (ingredientId === -1) {
                    //check if it indeed is a new ingredient
                    ingredientId = await addNewIngredient(newIngredient);
                    //make the ingredientId the id of the new ingredient
                    //  getIngredientId(newIngredient);
                }

                pool.query(
                    "INSERT INTO ingredients (recipe_id, ingredient_id, unit_id, quantity) VALUES ($1, $2, $3, $4)",
                    [req.body.recipeId, ingredientId, unitId, quantity],
                    (error: Error, results: any) => {
                        if (error) {
                            throw error;
                        }
                    }
                );
                // }
                res.status(201).send("Ingredients added to recipe.");
                console.log("Ingredients added to recipe.");
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
    pool.query(
        "DELETE FROM ingredients",
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`All ingredients deleted`);
        }
    );
});

async function addNewIngredient(newIngredient) {
    try {
        const { rows } = await pool.query(
            "INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *",
            [newIngredient]
        );
        const newIngredientId = rows[0].id;
        console.log(`new Ingredient added with ID: ${newIngredientId}`);
        return newIngredientId;
    } catch (error) {
        console.error(error);
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
        console.log(`new Unit added with ID: ${newUnitId}`);
        return newUnitId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = router;
