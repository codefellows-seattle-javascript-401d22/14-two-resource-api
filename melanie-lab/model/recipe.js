'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  listId: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('recipe', recipeSchema);