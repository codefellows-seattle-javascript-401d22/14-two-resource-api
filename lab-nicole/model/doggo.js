'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Doggo = Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
});

module.exports = mongoose.model('doggo', Doggo);