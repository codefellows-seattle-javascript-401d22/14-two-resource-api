'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('insurance:insured-routes');
const Insured = require('../model/insured.js');

const insuredRouter = module.exports = new Router();

insuredRouter.get('/api/insured/:insuredId', (req, res, next) => {
  debug('GET: /api/insured/:insuredId');

  Insured.findById(req.params.insuredId)
    .populate('lifepolicies')
    .then( insured => res.json(insured))
    .catch(next);
});

insuredRouter.post('/api/insured', jsonParser, (req, res, next) => {
  debug('POST: /api/insured');

  new Insured(req.body).save()
    .then( insured => res.json(insured))
    .catch(next);
});

insuredRouter.put('/api/insured/:insuredId', jsonParser, (req, res, next) => {
  debug('PUT: /api/insured/:insuredId');

  Insured.findByIdAndUpdate(req.params.insuredId, req.body, { new: true})
    .then( insured => res.json(insured))
    .catch( err => {
      if(err.name === 'ValidationError') return next(err);
      next(createError(404, err.message));
    });
});

insuredRouter.delete('/api/insured/:insuredId', (req, res, next) => {
  debug('DELETE: /api/insured/:insuredId');

  Insured.findByIdAndRemove(req.params.insuredId)
    .then( () => res.status(204).send())
    .catch( err => next(createError(404, err.message)));
});