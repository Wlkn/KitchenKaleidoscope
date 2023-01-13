"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json()); // for application/json
app.use(express.urlencoded({ extended: true })); // for application/x-www-form-urlencoded
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
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
//ENDPOINTS
app.use("/api/recipes", recipeRoute); // This targets every that starts with /api/recipes so the :id works too.
app.use("/auth", userRoute); // Same with this one.
module.exports = app;
