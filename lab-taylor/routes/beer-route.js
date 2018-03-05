'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('beer:beer-router');
const Brewery = require('../model/brewery.js');

const beerRouter = module.exports = new Router();

beerRouter.post('/api/brewery/:breweryId/beer', jsonParser, function(req, res, next) {
  debug('POST: /api/brewery/breweryId/beer');

  Brewery.findByIdAndAddBeer(req.params.breweryId, req.body)
    .then( beer => res.json(beer))
    .catch(next);
});

beerRouter.get('/api/brewery/:breweryId', function(req, res, next) {
  debug('GET: /api/brewery/breweryId');

  Brewery.findById(req.params.breweryId)
    .then( brewery => res.json(brewery))
    .catch(next);
});

beerRouter.put('/api/brewery/:breweryId/beer/:beerId', jsonParser, function(req, res, next) {
  debug('PUT: /api/brewery/:breweryId/beer/:beerId');

  //finish put route
});

beerRouter.delete('/api/brewery/:breweryId/beer/:beerId', function(req, res, next) {
  debug('DELETE: /api/brewery/:breweryId/beer/:beerId');
  
  //finsh delete
});