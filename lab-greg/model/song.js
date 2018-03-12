'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = Schema ({
  name: { type: String, required: true },
  content: { type: String, required: true },
  songlistID: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('song', songSchema);