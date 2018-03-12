'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('note:songlist-route');
const createError = require('http-errors');
const Song = require('../model/songlist.js');
const songRouter = module.exports = new Router();

songRouter.get('/api/song/:songId', function(req, res, next) {
  debug('GET: /api/song/:songId');

  Song.findById(req.params.songId)
    .populate('song')
    .then( song => res.json(song))
    .catch(next);
});

songRouter.post('/api/song', jsonParser, function(req, res, next) {
  debug('POST: /api/song');

  req.body.timestamp = new Date();
  new Song(req.body).save()
    .then( song => res.json(song))
    .catch(next);
});

songRouter.put('/api/song/:songId', jsonParser, function(req, res, next) {
  debug('PUT: /api/song/:songId');

  Song.findByIdAndUpdate(req.params.songId, req.body, { new: true })
    .then( song => res.json(song))
    .catch( err => {
      if (err.name === 'ValidationError') return next(err);
      next(createError(404, err.message));
    });
});

songRouter.delete('/api/song/:songId', function(req, res, next) {
  debug('DELETE: /api/song/:songId');

  Song.findByIdAndRemove(req.params.songId)
    .then( () => res.status(204).send())
    .catch( err => next(createError(404, err.message)));
});