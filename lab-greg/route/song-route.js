'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('note:song-route');
const Song = require('../model/song.js');

const songRouter = module.exports = new Router();

songRouter.post('/api/songlist/:songlistID/note', jsonParser, function(req, res, next) {
  debug('POST: /api/songlist/:songlistId/note');

  Song.findByIdAndAddNote(req.params.songlistID, req.body)
    .then( song => res.json(song))
    .catch(next);
});