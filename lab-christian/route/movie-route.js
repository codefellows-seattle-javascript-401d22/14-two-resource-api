'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('movie:movie-route');
const List = require('../model/list');

const movieRouter = module.exports = new Router();

movieRouter.post('/api/list/:listId/movie', jsonParser, function(req, res, next) {
  debug('POST: /api/list/:listId/movie');

  List.findByIdAndAddMovie(req.params.listId, req.body)
    .then( movie => res.json(movie))
    .catch(next);
});