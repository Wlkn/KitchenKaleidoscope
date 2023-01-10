const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = Schema({
    _id: { type: String, required: true },
    name: { type: String},
    description: { type: String},
    instructions: { type: String},
  });