'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('beer:beer-router');
const Brewery = require('../model/brewery.js');
const Beer = require('../model/beer.js');

const beerRouter = module.exports = new Router();

beerRouter.post('/api/brewery/:breweryId/beer', jsonParser, function(req, res, next) {
  debug('POST: /api/brewery/breweryId/beer');

  if(!req.body.name || !req.body.style) {
    return next(createError(400, 'Bad Request'));
  }

  Brewery.findByIdAndAddBeer(req.params.breweryId, req.body)
    .then( beer => res.json(beer))
    .catch(next);
});

beerRouter.get('/api/beer/:beerId', function(req, res, next) {
  debug('GET: /api/beer/beerId');

  Beer.findById(req.params.beerId)
    .then( beer => res.json(beer))
    .catch(next);
});

beerRouter.put('/api/beer/:beerId', jsonParser, function(req, res, next) {
  debug('PUT: /api/brewery/:breweryId/beer/:beerId');

  if(!req.body.name || !req.body.style) {
    return next(createError(400, 'Bad Request'));
  }

  Beer.findByIdAndUpdate(req.params.beerId, req.body, { new: true})
    .then( beer => res.json(beer))
    .catch(next);
});

beerRouter.delete('/api/beer/:beerId', function(req, res, next) {
  debug('DELETE: /api/brewery/:breweryId/beer/:beerId');
  
  Beer.findByIdAndRemove(req.params.beerId)
    .then( () => res.sendStatus(204))
    .catch(next);
});