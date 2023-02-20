import express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
app.use(cors());
require("dotenv").config();

//mongodbn
import mongoose = require("mongoose");
mongoose.set("strictQuery", true);
//todo Make the website usable and clean //fix
//todo make the recipes details page
//todo make the recipes actually be linked to the user that created them. //done
//todo add comments and likes to the recipes.

//todo link the ingredient_names and units and ingredients to the recipe_id. // done
//todo when receiving a newIngredient string in the body, check if it exists in the ingredient_names collection, if not, add it. //done
//todo when receiving a newUnit string in the body, check if it exists in the units collection, if not, add it. //done
//todo add the remove,update and get routes for the ingredients. Theses inlude the ingredient_names and units.

mongoose
    .connect(process.env.MANGODB_CONNECTION_STRING || " ")
    .then(() => {
        console.log("Connected to Mango's Database");
    })
    .catch((error) => {
        console.log("Unable to connect to MongoDB.");
        console.error(error);
    });

//AUTHENTICATION

const auth = require("./routes/api/auth");

//ROUTES

const recipeRoute = require("./routes/api/recipes");
const userRoute = require("./routes/api/users");
const commentRoute = require("./models/Comments");
const ingredientRoute = require("./models/Ingredients");
const ingredientNamesRoute = require("./models/IngredientNames");
const unitRoute = require("./models/Units");
const likesRoute = require("./models/Likes");
//redirect all the wrong requess to the home page.

//ENDPOINTS
app.use("/auth", userRoute); // Same with this one.
//mongodb
app.use("/api/recipes", recipeRoute); // This targets every that starts with /api/recipes so the :id works too.
app.use("/api/likes", auth, likesRoute);
//postgres
app.use("/api/comments", auth, commentRoute);
app.use("/api/ingredients", ingredientRoute);
app.use("/api/ingredientNames", ingredientNamesRoute);
app.use("/api/units", unitRoute);

module.exports = app;
