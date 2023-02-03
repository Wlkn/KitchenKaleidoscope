"use strict";
const express = require("express");
const router = express.Router();
const Recipe = require("../../models/Recipe");
const User = require("../../models/User");
// @route   GET api/recipes
// POST ROUTE TO ADD RECIPES
router.post("/", (req, res, next) => {
    const recipe = new Recipe({
        // Id is automatically generated try to figure it out in the front end
        name: req.body.recipeName,
        description: req.body.description,
        instructions: req.body.instructions,
        imageUrl: req.body.imageUrl,
    });
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
        .catch((error) => {
        res.status(400).json({
            error: error,
        });
        console.log(error);
    });
});
//PUT ROUTE TO UPDATE THE RECIPE WITH THE RECIPEID RECIEVED FROM THE FRONT END
router.put("/:id", (req, res, next) => {
    Recipe.updateOne({ _id: req.params.id }, {
        $set: {
            name: req.body.name,
            description: req.body.description,
            instructions: req.body.instructions,
            imageUrl: req.body.imageUrl,
        },
    })
        .then(() => {
        res.status(200).json({
            message: `The recipe with the ID of ${req.params.id} has been updated.`,
        });
        console.log(`The recipe with the ID of ${req.params.id} has been updated.`);
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
        console.log(`The recipe with the ID of ${req.params.id} has been deleted.`);
    })
        .catch((error) => {
        res.status(400).json({
            error: error,
        });
        console.log(error);
    });
});
// GET ROUTES
// GET ROUTE TO GET ALL RECIPIES
// /api/recipes
router.get("/", (req, res, next) => {
    Recipe.find()
        .then((recipes) => {
        res.status(200).json(recipes);
    })
        .catch((recipes) => {
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
        .then((recipe) => {
        res.status(200).json(recipe);
    })
        .catch((error) => {
        res.status(404).json({
            error: error,
        });
    });
});
function updateUserRecipes(req, recipeId) {
    User.findOneAndUpdate({ _id: req.auth.userId.userId }, { $push: { recipes: recipeId } })
        .then(() => {
        console.log("Recipe added to user.");
    })
        .catch((error) => {
        console.log(error);
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
        .catch((error) => {
        res.status(500).json({
            error: error,
            message: "Something wrong happened.",
        });
    });
});
//find all recipes of a user
router.get("/myrecipes/:user_id", (req, res, next) => {
    User.findOne({ _id: req.params.user_id })
        .then((user) => {
        if (!user) {
            return res.status(404).json({
                error: Error,
                message: "User not found",
            });
        }
        const recipeIds = user.recipes;
        Promise.all(recipeIds.map((id) => Recipe.findById(id))).then((recipes) => {
            res.status(200).json({
                recipes,
            });
        });
    })
        .catch((error) => {
        res.status(500).json({
            error: error,
            message: "Something wrong happened.",
        });
    });
});
module.exports = router;
