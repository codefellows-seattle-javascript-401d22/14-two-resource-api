'use strict';

const mongoose = require('mongoose');

const entreeSchema = mongoose.Schema({
  name: {type: String, required: true },
  price: {type: Number, required: true },
  menuID: {type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('entree', entreeSchema);