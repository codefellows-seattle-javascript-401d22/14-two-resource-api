'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('movie:list-route');
const List = require('../model/list');
const createError = require('http-errors');

const listRouter = module.exports = new Router();

listRouter.get('/api/list/:listId', function(req, res, next) {
  debug('GET: /api/list/:listId');

  List.findById(req.params.listId)
    .populate('movies')
    .then( list => res.json(list))
    .catch(err => next(createError(404, err.message)));
});

listRouter.post('/api/list', jsonParser, function(req, res, next) {
  debug('POST: /api/list');

  req.body.timestamp = new Date();
  new List(req.body).save()
    .then( list => res.json(list))
    .catch(err => next(err));    
});

listRouter.put('/api/list/:listId', jsonParser, function(req, res, next) {
  debug('PUT: /api/list/:listId');

  List.findByIdAndUpdate(req.params.listId, req.body, { new: true })
    .then( list => res.json(list))
    .catch(err => next(createError(400, err.message)));
});

listRouter.delete('/api/list/:listId', function(req, res, next) {
  debug('DELETE: /api/list/:listId');

  List.findByIdAndRemove(req.params.listId)
    .send( () => res.status(204))
    .catch(err => next(createError(404, err.message)));    
});