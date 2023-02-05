"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const pool = require("../postGres");
router.post("/", (req, res) => {
    console.log(req.body); //TODO REMOVE THIS WHEN DONE
    pool.query("SELECT to_regclass('ingredient')", (error, results) => {
        if (error) {
            throw error;
        }
        const { name } = req.body;
        pool.query("INSERT INTO ingredient_names (name) VALUES ($1) RETURNING *", [name], (error, results) => {
            if (error) {
                throw error;
            }
            res.status(201).send(`Ingredient added with ID: ${results.rows[0].id}`);
            console.log(`Ingredient added with ID: ${results.rows[0].id}`);
            //TODO REMOVE THIS WHEN DONE
        });
    });
});
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    pool.query("UPDATE ingredient_names SET name = $1 WHERE id = $2", [name, id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Ingredient modified with ID: ${id}`);
    });
});
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    pool.query("DELETE FROM ingredient_names WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Ingredient deleted with ID: ${id}`);
    });
});
router.get("/", (req, res) => {
    pool.query("SELECT * FROM ingredient_names", (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});
// function createTables() {
//     pool.query(
//         `CREATE TABLE ingredient_names (
//                 id SERIAL PRIMARY KEY,
//                 name TEXT NOT NULL
//                 );`,
//         (error: Error) => {
//             if (error) {
//                 throw error;
//             }
//             console.log("ingredient_names table created");
//         }
//     );
// }
module.exports = router;
