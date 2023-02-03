import express = require("express");
const router = express.Router();
const pool = require("../postGres");

router.post("/", (req, res) => {
    console.log(req.body); //TODO REMOVE THIS WHEN DONE
    pool.query(
        "SELECT to_regclass('units')",

        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            

            const { name } = req.body;
            pool.query(
                "INSERT INTO units (name) VALUES ($1) RETURNING *",
                [name],
                (error: Error, results: any) => {
                    if (error) {
                        throw error;
                    }
                    res.status(201).send(
                        `Unit added with ID: ${results.rows[0].id}`
                    );
                    console.log(`Unit added with ID: ${results.rows[0].id}`); //TODO REMOVE THIS WHEN DONE
                }
            );
        }
    );
});

router.get("/", (req, res) => {
    pool.query("SELECT * FROM units", (error: Error, results: any) => {
        if (error) {
            throw error;
        }
       
        res.status(200).json(results.rows);
    });
});

// function createTables() {
//     pool.query(
//         `
// CREATE TABLE units (
//     id SERIAL PRIMARY KEY,
//     name TEXT NOT NULL
// );`,
//         (error: Error) => {
//             if (error) {
//                 throw error;
//             }
//             console.log("comments table created");
//         }
//     );
// }

module.exports = router;
