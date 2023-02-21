const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    imageUrl: { type: String },
    isPublic: { type: Boolean, required: true },
    category: { type: String},
    area: { type: String},
});

module.exports = mongoose.model("Recipe", recipeSchema);
