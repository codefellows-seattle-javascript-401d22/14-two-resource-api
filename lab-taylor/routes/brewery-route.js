'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const debug = require('debug')('beer:brewery-route');
const Brewery = require('../model/brewery.js');
const breweryRouter = module.exports = new Router();

breweryRouter.get('/api/brewery/:breweryId', function(req, res, next) {
  debug('GET: /api/brewery/breweryId');

  if(!req.params.breweryId) return createError(400, 'Bad Request');

  Brewery.findById(req.params.breweryId)
    .populate('beers')
    .then( brewery => res.json(brewery))
    .catch(next);
});

breweryRouter.post('/api/brewery', jsonParser, function(req, res, next) {
  debug('POST: /api/brewery');

  req.body.timestamp = new Date();
  new Brewery(req.body).save()
    .then( brewery => res.json(brewery))
    .catch(next);
});

breweryRouter.put('/api/brewery/:breweryId', jsonParser, function(req, res, next) {
  debug('PUT: /api/brewey/breweryId');

  if(!req.body.name) {
    return next(createError(400, 'Bad Request'));
  }

  Brewery.findByIdAndUpdate(req.params.breweryId, req.body, { new: true})
    .then( brewery => res.json(brewery))
    .catch(next);
});

breweryRouter.delete('/api/brewery/:brewryId', function(req, res, next) {
  debug('DELETE: /api/brewery/breweryId');

  Brewery.findByIdAndRemove(req.params.breweryId)
    .then(() => res.status(204).send())
    .catch( err => next(createError(404, err.message)));
});