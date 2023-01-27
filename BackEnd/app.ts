import express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

//mongodb
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
    .connect(
        "mongodb+srv://Wlkn:vrcuITJZyZDemKby@cluster0.ztgyito.mongodb.net/?retryWrites=true&w=majority"
    )
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
const ingredient_nameRoute = require("./models/Ingredient_names");
const unitRoute = require("./models/Units");
const likesRoute = require("./models/Likes");

//ENDPOINTS

app.use("/api/recipes",auth, recipeRoute); // This targets every that starts with /api/recipes so the :id works too.
app.use("/api/comments", commentRoute);
app.use("/api/ingredients", ingredientRoute);
app.use("/api/likes", likesRoute);
app.use("/api/ingredient_names", ingredient_nameRoute);
app.use("/api/units", unitRoute);

app.use("/auth", userRoute); // Same with this one.

module.exports = app;
