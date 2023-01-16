import express = require("express");
const router = express.Router();
const pool = require("../postGres");

//ADD A LIKE WITH /api/likes/
router.post("/", (req, res) => {
    console.log(req.body); //TODO REMOVE THIS WHEN DONE
    pool.query(
        "SELECT to_regclass('likes')",

        (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            if (!results.rows[0].to_regclass) {
                createTables();
            }

            const { recipe_id, user_id, liked } = req.body;
            pool.query(
                "INSERT INTO likes (recipe_id, user_id, liked) VALUES ($1, $2, $3) RETURNING *",
                [recipe_id, user_id, liked],
                (error: Error, results: any) => {
                    if (error) {
                        throw error;
                    }
                    res.status(201).send(
                        `Like added with ID: ${results.rows[0].id}`
                    );
                    console.log(`Like added with ID: ${results.rows[0].id}`); //TODO REMOVE THIS WHEN DONE
                }
            );
        }
    );
});

//UPDATE THE LIKE WITH /api/like/id
//set liked to true or false

router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        "UPDATE likes SET liked = $1 WHERE id = $2",
        [req.body.liked, id],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Like modified with ID: ${id}`);
            console.log(`Like modified with ID: ${id}`); //TODO REMOVE THIS WHEN DONE
        }
    );
});



function createTables() {
    pool.query(
        "CREATE TABLE likes (id SERIAL PRIMARY KEY, recipe_id CHAR(24), user_id CHAR(24), liked BOOLEAN NOT NULL, created_at TIMESTAMP DEFAULT NOW())",
        (error: Error) => {
            if (error) {
                throw error;
            }
            console.log("likes table created");
        }
    );
}

module.exports = router;