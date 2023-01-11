const express = require("express");
const router = express.Router();

const Recipe = require("../../models/Recipe");

// @route   GET api/recipes
// POST ROUTE TO ADD RECIPES
router.post("/", (req, res, next) => {
    const recipe = new Recipe({
        // Id is automatically generated try to figure it out in the front end
        name: req.body.name,
        description: req.body.description,
        instructions: req.body.instructions,
        imageUrl: req.body.imageUrl,
    });

    recipe
        .save()
        .then(() => {
            res.status(201).json({
                message: "Post saved successfully!",
            });
        })
        .catch((error: Error) => {
            res.status(400).json({
                error: error,
            });
        });
});
//PUT ROUTE TO UPDATE RECIPES
router.put("/:id", (req, res, next) => {
    const recipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        instructions: req.body.instructions,
        imageUrl: req.body.imageUrl,
    });
    Recipe.updateOne({ _id: req.params.id }, recipe)
        .then(() => {
            res.status(201).json({
                message: `The recipe with the ID of ${req.params.id} has been updated.`,
            });
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
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
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            });
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

// GET ROUTE TO GET ONE RECIPE
// /api/recipes/:id
router.get("/:id", (req, res, next) => {
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

module.exports = router;
