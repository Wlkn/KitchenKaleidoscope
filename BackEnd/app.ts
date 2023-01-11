import express = require("express");
import mongoose = require("mongoose");
const Recipe = require("./models/Recipe");
const cors = require("cors")


const app = express();
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
app.use(cors())
mongoose.set("strictQuery", true);

mongoose
    .connect(
        "mongodb+srv://Wlkn:vrcuITJZyZDemKby@cluster0.ztgyito.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Connected to Mangoo's Database");
    })
    .catch((error) => {
        console.log("Unable to connect to MongoDB.");
        console.error(error);
    });

app.post("/api/recipes", (req, res, next) => {
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

app.get("/api/recipes", (req, res, next) => {
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

app.get("/api/recipes/:id", (req, res, next) => {
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

module.exports = app;
