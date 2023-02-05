"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
//mongodbn
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

mongoose
    .connect("mongodb+srv://Wlkn:vrcuITJZyZDemKby@cluster0.ztgyito.mongodb.net/?retryWrites=true&w=majority")
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
app.use("/auth", userRoute); // Same with this one.
//mongodb
app.use("/api/recipes", auth, recipeRoute); // This targets every that starts with /api/recipes so the :id works too.
app.use("/api/likes", likesRoute);
//postgres
app.use("/api/comments", commentRoute);
app.use("/api/ingredients", ingredientRoute);
app.use("/api/ingredient_names", ingredient_nameRoute);
app.use("/api/units", unitRoute);
module.exports = app;
