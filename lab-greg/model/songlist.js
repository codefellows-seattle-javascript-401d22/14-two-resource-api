'use strict';

const mongoose = require('mongoose');
const debug = require('debug');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Song = require('./song.js');

const songListSchema = Schema ({
  name: { type: String, required : true },
  timestamp: { type: Date, required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'song'}],
});

const Songlist = module.exports = mongoose.model('songlist', songListSchema);


Songlist.findByIdAndAddSong = function(id, song) {
  debug('findByIdAndAddSong');

  return Songlist.findById(id)
    .catch( err => Promise.reject(createError(404, err.message)))
    .then( songlist => {
      song.songlistId = songlist._id;
      this.tempSonglist = song;
      return new Song(song).save();
    })
    .then( () => {
      return this.tempSonglist;
    });
};

