import express = require("express");
const router = express.Router();
const pool = require("../postGres");

router.post("/", (req, res) => {
    console.log(req.body); //TODO REMOVE THIS WHEN DONE
    pool.query(
        "SELECT to_regclass('ingredient')",

        async (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            const { name } = await req.body;
            pool.query(
                "INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *",
                [name],
                async (error: Error, results: any) => {
                    if (error) {
                        throw error;
                    }
                    const { rows } = await results;
                    res.json(rows[0].id);
                    res.status(201).send(
                        `Ingredient added with ID: ${rows[0].id}`
                    );

                    console.log(`Ingredient added with ID: ${rows[0].id}`);
                    //TODO REMOVE THIS WHEN DONE
                }
            );
        }
    );
});

router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    pool.query(
        "UPDATE ingredient_names SET name = $1 WHERE id = $2",
        [name, id],

        async (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            res.status(200).send(`Ingredient modified with ID: ${id}`);
        }
    );
});

router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(
        "DELETE FROM ingredient_names WHERE id = $1",
        [id],
        async (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            res.status(200).send(`Ingredient deleted with ID: ${id}`);
        }
    );
});

router.get("/", (req, res) => {
    pool.query(
        "SELECT * FROM ingredient_names",
        async (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    );
});

router.get("/:name", (req, res) => {
    const name = req.params.name;
    pool.query(
        "SELECT * FROM ingredient_names WHERE name = $1",
        [name],
        async (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    );
});

module.exports = router;
