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

            

            const { recipe_id, user_id, liked } = req.body;
            pool.query(
                "SELECT * FROM likes WHERE recipe_id = $1 AND user_id = $2",
                [recipe_id, user_id],
                (error: Error, results: any) => {
                    if (error) {
                        throw error;
                    } else if (results.rows.length === 0) {
                        addLike(recipe_id, user_id, liked, res);
                    } else if (results.rows.length > 0) {
                        updateLike(recipe_id, user_id, liked, res);
                    } else {
                        res.status(400).json({
                            message: "Something went wrong",
                        });
                    }
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

router.get("/", (req, res) => {
    pool.query("SELECT * FROM likes", (error: Error, results: any) => {
        
        
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
});

router.get("/:id", (req, res) => {
    const userId = req.params.id;

    pool.query(
        "SELECT * FROM likes WHERE user_id = $1 AND liked = true",
        [userId],
        (error: Error, results: any) => {
             if (error) {
                throw error;
            } else if (results.rows.length === 0) {
                res.status(200).json({ message: "No liked recipes found" });
            } else if (results.rows.length > 0) {
                res.status(200).json(results.rows);
            }
        }
    );
});
function addLike(recipe_id: string, user_id: string, liked: boolean, res: any) {
    pool.query(
        "INSERT INTO likes (recipe_id, user_id, liked) VALUES ($1, $2, $3) RETURNING *",
        [recipe_id, user_id, liked],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            

            res.status(201).json(`Like added with ID: ${results.rows[0].id}`);
            console.log(`Like added with ID: ${results.rows[0].id}`); //TODO REMOVE THIS WHEN DONE
        }
    );
}
function updateLike(
    recipe_id: string,
    user_id: string,
    liked: boolean,
    res: any
) {
    pool.query(
        "UPDATE likes SET liked = $1 WHERE recipe_id = $2 AND user_id = $3 RETURNING *",
        [liked, recipe_id, user_id],
        (error: Error, results: any) => {
            if (error) {
                throw error;
            }
            res.status(201).json(`Like updated with ID: ${results.rows[0].id}`);
            console.log(`Like updated with ID: ${results.rows[0].id}`);
        }
    );
}

//keep this commented as it will delete wipe the table clean
router.delete("/", (req, res) => {
    pool.query("DELETE FROM likes", (error: Error, results: any) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Likes table deleted`);
        console.log(`Likes table deleted`); //TODO REMOVE THIS WHEN DONE
    });
});

// function createTables() {
//     pool.query(
//         "CREATE TABLE likes (id SERIAL PRIMARY KEY, recipe_id CHAR(24), user_id CHAR(24), liked BOOLEAN NOT NULL, created_at TIMESTAMP DEFAULT NOW())",
//         (error: Error) => {
//             if (error) {
//                 throw error;
//             }
//             console.log("likes table created");
//         }
//     );
// }

module.exports = router;
