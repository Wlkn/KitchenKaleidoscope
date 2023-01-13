"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recipeSchema = Schema({
    name: { type: String },
    description: { type: String },
    instructions: { type: String },
    imageUrl: { type: String },
});
module.exports = mongoose.model("Recipe", recipeSchema);
