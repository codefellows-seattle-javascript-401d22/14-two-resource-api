'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('car:car-router');
const List = require('../model/list.js');
const Car = require('../model/car.js');
const createError = require('http-errors');
const carRouter = module.exports = new Router();

carRouter.get('/api/car/:carId', function(req, res, next) {
  debug('GET: /api/car/:carId');

  Car.findById(req.params.carId)
    .populate('cars')
    .then( car => res.json(car))
    .catch( err => {
      createError(404, err.message);
      next();
    });
});

carRouter.post('/api/list/:listId/car', jsonParser, function(req, res, next) {
  debug('POST: /api/list/:listId/car');

  List.findByIdAndAddCar(req.params.listId, req.body)
    .then( car => res.json(car))
    .catch( err => next(err));
});

carRouter.put('/api/car/:carId', jsonParser, function(req, res, next) {

  if (!req.body.name) next(createError(400, 'Bad request'));

  Car.findByIdAndUpdate(req.params.carId, req.body, {new: true})
    .then( car => res.json(car))
    .catch( err => {
      if (err.name === 'ValidationError') return next(err);
      next(createError(404, err.message));
    });
});

carRouter.delete('/api/car/:carId', function(req, res, next) {
  debug('DELETE: /api/car/:carId');

  Car.findByIdAndRemove(req.params.carId)
    .populate('cars')
    .then( () => res.status(200).send())
    .catch( err => {
      createError(404, err.message);
      next();
    });
});