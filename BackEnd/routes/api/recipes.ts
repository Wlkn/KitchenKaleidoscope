const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Recipe = require("../../models/Recipe");
const User = require("../../models/User");
// @route   GET api/recipes
// POST ROUTE TO ADD RECIPES
router.post("/", (req, res, next) => {
    let imageUrl = req.body.imageUrl;
    if (!imageUrl) {
        imageUrl = "https://i.ibb.co/Xkm4yvK/fallbackpicture.png";
    }
    const recipe = new Recipe({
        name: req.body.recipeName,
        description: req.body.description,
        instructions: req.body.instructions,
        imageUrl: imageUrl,
        isPublic: req.body.isPublic,
        category: req.body.category,
        area: req.body.area,
    });
    // console.log(req.body.isPublic);

    recipe
        .save()
        .then(() => {
            const recipeId = recipe._id.toHexString();
            //push the recipeId to the user
            updateUserRecipes(req, recipeId);
            res.status(200).json({
                recipeId: recipeId,
            });
            // console.log(recipeId);
        })
        .catch((error: Error) => {
            res.status(400).json({
                error: error,
            });
            // console.log(error);
        });
});
//PUT ROUTE TO UPDATE THE RECIPE WITH THE RECIPEID RECIEVED FROM THE FRONT END

router.put("/:id", (req, res, next) => {
    Recipe.updateOne(
        { _id: req.params.id },
        {
            $set: {
                name: req.body.name,
                description: req.body.description,
                instructions: req.body.instructions,
                imageUrl: req.body.imageUrl,
                isPublic: req.body.isPublic,
                category: req.body.category,
                area: req.body.area,
            },
        }
    )
        .then(() => {
            res.status(200).json({
                message: `The recipe with the ID of ${req.params.id} has been updated.`,
            });
            // console.log(
            //     `The recipe with the ID of ${req.params.id} has been updated.`
            // );
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
            console.log(error);
        });
});

//DELETE ROUTE
// /api/recipes/id
router.delete("/:id", (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(200).json({
                message: `The recipe with the ID of ${req.params.id} has been deleted.`,
            });
            // console.log(
            //     `The recipe with the ID of ${req.params.id} has been deleted.`
            // );
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
            // console.log(error);
        });
});
// GET ROUTES
// GET ROUTE TO GET ALL RECIPIES
// /api/recipes
router.get("/", (req, res, next) => {
    Recipe.find()
        .then((recipes: Object) => {
            res.status(200).json(recipes);
        })
        .catch((recipes: Object) => {
            res.status(400).json({
                error: Error,
                recipes,
            });
        });
});
//get 20 recipes per page that are public and the newest first
router.get("/page/:page", (req, res, next) => {
    Recipe.find({ isPublic: true })
        .sort({ _id: -1 })
        .skip((req.params.page - 1) * 20)
        .limit(20)
        .then((recipes: Object) => {
            res.status(200).json(recipes);
        })
        .catch((error: Error) => {
            res.status(400).json({
                error: error,
            });
        });
});
//get 10 random recipes that are public
router.get("/random", (req, res, next) => {
    Recipe.aggregate([
        { $sample: { size: 10 } },
        { $match: { isPublic: true } },
    ])
        .then((recipes: Object) => {
            res.status(200).json(recipes);
        })
        .catch((error: Error) => {
            res.status(400).json({
                error: error,
            });
        });
});
//get 10 random recipes that are public

// GET ROUTE TO GET ONE RECIPE
// /api/recipes/:id
router.get("/one/:id", (req, res, next) => {
    Recipe.findOne({
        _id: req.params.id,
    })
        .then((recipe: Object) => {
            res.status(200).json(recipe);
        })
        .catch((error: Error) => {
            res.status(404).json({
                error: error,
            });
        });
});

function updateUserRecipes(req, recipeId) {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken;
    User.findOneAndUpdate(
        { _id: userId.userId },
        { $push: { recipes: recipeId } }
    )
        .then(() => {
            // console.log("Recipe added to user.");
        })
        .catch((error: Error) => {
            // console.log(error);
        });
}

//find who owns the recipe with the recipe_id
router.get("/user/:recipe_id", (req, res, next) => {
    User.findOne({ recipes: req.params.recipe_id })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: Error,
                    message: "User not found",
                });
            }
            res.status(200).json({
                userId: user._id,
                OwnerName: user.name,
            });
        })
        .catch((error: Error) => {
            res.status(500).json({
                error: error,
                message: "Something wrong happened.",
            });
        });
});
//find all recipes of a user
router.get("/myrecipes/:user_id", (req, res, next) => {
    User.findOne({ _id: req.params.user_id })
        .then((user: { recipes: any }) => {
            if (!user) {
                return res.status(404).json({
                    error: Error,
                    message: "User not found",
                });
            }

            const recipeIds = user.recipes;
            Promise.all(recipeIds.map((id) => Recipe.findById(id))).then(
                (recipes) => {
                    res.status(200).json({
                        recipes,
                    });
                }
            );
        })
        .catch((error: Error) => {
            res.status(500).json({
                error: error,
                message: "Something wrong happened.",
            });
        });
});

//get all recipes of a user by page of 20
router.get("/myrecipes/:user_id/:page", (req, res, next) => {
    User.findOne({ _id: req.params.user_id })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: Error,
                    message: "User not found",
                });
            }
            const recipeIds = user.recipes;
            Promise.all(recipeIds.map((id) => Recipe.findById(id)))
                .then((recipes) => {
                    res.status(200).json({
                        recipes: recipes.slice(
                            (req.params.page - 1) * 20,
                            req.params.page * 20
                        ),
                    });
                })
                .catch((error: Error) => {
                    res.status(500).json({
                        error: error,
                        message: "Something wrong happened.",
                    });
                });
        })
        .catch((error: Error) => {
            res.status(500).json({
                error: error,
                message: "Something wrong happened.",
            });
        });
});

//delete all the recipes keep commented for now
// router.delete("/", (req, res, next) => {
//     Recipe.deleteMany({})
//         .then(() => {
//             res.status(200).json({
//                 message: "All recipes have been deleted.",
//             });
//             console.log("All recipes have been deleted.");
//         })
//         .catch((error) => {
//             res.status(400).json({
//                 error: error,
//             });
//             console.log(error);
//         });
// });
//get name of user from id
router.get("/name/:user_id", (req, res, next) => {
    User.findOne({ _id: req.params.user_id })

        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    error: Error,
                    message: "User not found",
                });
            }
            res.status(200).json({
                name: user.name,
            });
        })

        .catch((error: Error) => {
            res.status(500).json({
                error: error,
                message: "Something wrong happened.",
            });
        });
});

//search bar get

// get all the categories that the receipes have
router.get("/category/all", (req, res, next) => {
    Recipe.find({ isPublic: true })
        .then((recipes: any) => {
            const categories = recipes.map((recipe) => recipe.category);
            const uniqueCategories = [...new Set(categories)];
            res.status(200).json(uniqueCategories);
        })
        .catch((error: Error) => {
            res.status(400).json({
                error: error,
            });
        });
});

//get recipes by page of 20 of the received category
//todo

//get recipes by page of 20 of the received area
router.get("/area/all", (req, res, next) => {
    Recipe.find({ isPublic: true })
        .then((recipes: any) => {
            const areas = recipes.map((recipe) => recipe.area);
            const uniqueAreas = [...new Set(areas)];
            res.status(200).json(uniqueAreas);
        })
        .catch((error: Error) => {
            res.status(400).json({
                error: error,
            });
        });
});

router.get(`/filter`, (req, res, next) => {
    Recipe.find({ isPublic: true })
        .then((recipes: any) => {
            let filteredRecipes = recipes;

            // Apply category filter if present
            if (req.query.categories) {
                const categories = req.query.categories.split(",");
                filteredRecipes = filteredRecipes.filter((recipe) => {
                    return categories.some((category) => {
                        return recipe.category
                            .toLowerCase()
                            .includes(category.toLowerCase());
                    });
                });
            }

            // Apply area filter if present
            if (req.query.areas) {
                const areas = req.query.areas.split(",");
                filteredRecipes = filteredRecipes.filter((recipe) => {
                    return areas.some((area) => {
                        return recipe.area
                            .toLowerCase()
                            .includes(area.toLowerCase());
                    });
                });
            }

            // Apply search filter if present
            if (req.query.search) {
                const search = req.query.search.toLowerCase();
                filteredRecipes = filteredRecipes.filter((recipe) => {
                    return recipe.name.toLowerCase().includes(search);
                });
            }

            res.status(200).json(filteredRecipes);
        })
        .catch((error: Error) => {
            res.status(400).json({
                error: error,
            });
        });
});

module.exports = router;
