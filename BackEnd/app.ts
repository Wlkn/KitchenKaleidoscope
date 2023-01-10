import express = require("express");
import mongoose = require("mongoose");
const Recipe = require("./models/Recipe");

const app = express();
app.use(express.json());             // for application/json
app.use(express.urlencoded());       // for application/x-www-form-urlencoded
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
        // console.error(error);
    });

app.post("/api/recipe", (req, res, next) => {
    const recipe = new Recipe({
        _id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        instructions: req.body.instructions,
    });

    recipe
        .save()
        .then(() => {
            res.status(201).json({
                message: "Post saved successfully!",
            });
        })
        .catch((error: Object) => {
            res.status(400).json({
                error: req,
            });
        });
});

app.get("/api/recipe", (req, res, next) => {
    Recipe.find()
        .then((recipe) => {
            res.status(200).json(recipe);
        })
        .catch((recipe) => {
            res.status(400).json({
                error: Error,
            });
        });
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message: "Your request was successful!" });
    next();
});

app.use((req, res, next) => {
    console.log("Response sent successfully!");
});
module.exports = app;
