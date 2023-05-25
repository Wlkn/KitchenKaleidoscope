import express = require("express");
const router = express.Router();
const pool = require("../postGres");

//ADD A COMMENT WITH /api/comments/
router.post("/", (req, res) => {
    // console.log(req.body); //TODO REMOVE THIS WHEN DONE
    pool.query(
        "SELECT to_regclass('comments')",

        (error: Error, results: any) => {
            if (error) {
                throw error;
            }

            const { recipe_id, user_id, comment } = req.body;
            pool.query(
                "INSERT INTO comments (recipe_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *",
                [recipe_id, user_id, comment],
                (error: Error, results: any) => {
                    if (error) {
                        throw error;
                    }
                    res.status(201).json(
                        `Comment added with ID: ${results.rows[0].id}`
                    );
                    // console.log(`Comment added with ID: ${results.rows[0].id}`); //TODO REMOVE THIS WHEN DONE
                }
            );
        }
    );
});

//UPDATE A COMMENT WITH /api/comments/id
router.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        "UPDATE comments SET comment = $1 WHERE id = $2",
        [req.body.comment, id],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Comment modified with ID: ${id}`);
            // console.log(`Comment modified with ID: ${id}`); //TODO REMOVE THIS WHEN DONE
        }
    );
});

//DELETE A COMMENT WITH /api/comments/id
router.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(
        "DELETE FROM comments WHERE id = $1",
        [id],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Comment deleted with ID: ${id}`);
            // console.log(`Comment deleted with ID: ${id}`); //TODO REMOVE THIS WHEN DONE
        }
    );
});

//GET ALL COMMENTS WITH /api/comments
router.get("/", (req, res) => {
    pool.query("SELECT * FROM comments", (error: Error, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
        // console.log(results.rows); //TODO REMOVE THIS WHEN DONE
    });
});

//GET A SINGLE COMMENT WITH /api/comments/id
router.get("/:id", (req, res) => {
    const id = req.params.id;

    pool.query(
        "SELECT * FROM comments WHERE recipe_id = $1",
        [id],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
            // console.log(results.rows); //TODO REMOVE THIS WHEN DONE
        }
    );
});

//DELETE ALL COMMENTS, LEAVE THIS COMMENTED OUT
// router.delete("/", (req, res) => {
//     pool.query("DELETE FROM comments", (error: Error, results: any) => {
//         if (error) {
//             throw error;
//         }
//         res.status(200).send(`All comments deleted`);
//         // console.log(`All comments deleted`);
//     });
// });

// INFO:
//TO DELETE, or UPDATE you need to auth it, so send the token as authorizatio and the user_id which will be in the body.
// function createTables() {
//     pool.query(
//         "CREATE TABLE comments (id SERIAL PRIMARY KEY, recipe_id CHAR(24) , user_id CHAR(24), comment TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW())",
//         (error: Error) => {
//             if (error) {
//                 throw error;
//             }
//             console.log("comments table created");
//         }
//     );
// }

module.exports = router;
