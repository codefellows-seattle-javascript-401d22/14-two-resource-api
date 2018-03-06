'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const toySchema = ({
  name: {type: String, required: true},
  color: {type: String, required: true},
  doggoID: {type: Schema.Types.ObjectId, required: true},
});

module.exports = mongoose.model('toy', toySchema);