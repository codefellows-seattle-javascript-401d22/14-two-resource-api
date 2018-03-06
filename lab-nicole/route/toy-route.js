'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('doggo:toy-route');
const createError = require('http-errors');
const Doggo = require('../model/doggo.js');
const Toy = require('../model/fav-toys.js');

const toyRouter = module.exports = new Router();

toyRouter.post('/api/doggo/:id/toy', bodyParser, function(req, res, next) {
  debug('POST: /api/doggo/:id/toy');
  if (!req.params.id) next(createError(400));

  Doggo.findByIdAndAddToy(req.params.id, req.body)
    .then( toy => {
      if (!toy) return createError(404);
      return res.json(toy);
    })
    .catch(next);
});

toyRouter.get('/api/toy/:toyId', function(req, res, next) {
  debug('GET: /api/toy/:toyId');
  if (!req.params.toyId) next(createError(400));

  Toy.findById(req.params.toyId)
    .populate('toys')
    .then( toy => {
      if (!toy) return next(createError(404));
      return res.json(toy);
    })
    .catch(err => {
      createError(404, err.message);
      next(err);
    });
});

toyRouter.put('/api/toy/:toyId', function(req, res, next) {
  debug('PUT: /api/toy/:toyId');
  if (!req.params.toyId) next(createError(400));

  Toy.findByIdAndUpdate(req.body.toyId, req.body, {new: true})
    .then( toy => {
      if (!toy) return next(createError(404));
      return res.json(toy);
    })
    .catch( err => {
      next(createError(404, err.message));
    });
});

toyRouter.delete('/api/toy/:toyId', function(req, res, next) {
  debug('DELETE: /api/toy/:toyId');
  if (!req.params.toyId) next(createError(400));

  Toy.findByIdAndRemove(req.body.toyId)
    .then( () => res.sendStatus(204))
    .catch( err => next(createError(404, err.message)));
});