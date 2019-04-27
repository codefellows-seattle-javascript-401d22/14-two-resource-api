'use strict';

const mongoose = require('mongoose'); //connects us to mongoDB with great methods
const Schema = mongoose.Schema;

const weedSchema = Schema({
  type: { type: String, required: true }, 
  strain: { type: String, required: true },
  listID: { type: Schema.Types.ObjectId, required: true }, //other resourceID good practice to connect the resources here
});

module.exports = mongoose.model('weed', weedSchema);

