'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const illustrationSchema = Schema({
  date: {type: Date, required: true},
  premiums_until_age: {type: Number, required: true},
  inforce_until_age: {type: Number, required: true},
  annualized_premiums: {type: Number, required: true},
  lifepolicyId: {type: Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('illustration', illustrationSchema);