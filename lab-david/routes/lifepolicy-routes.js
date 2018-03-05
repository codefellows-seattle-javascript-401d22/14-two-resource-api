'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('insurance:lifepolicy-routes');
const Insured = require('../model/insured.js');
const LifePolicy = require('../model/lifepolicy.js');

const lifepolicyRouter = module.exports = new Router();

lifepolicyRouter.get('/api/lifepolicy/:lifepolicyId', (req, res, next) => {
  debug('GET: /api/lifepolicy/:lifepolicyId');

  LifePolicy.findById(req.params.lifepolicyId)
    .populate('illustrations')
    .then( lifepolicy => res.json(lifepolicy))
    .catch( err => {
      err = createError(404, err.message);
      next(err);
    });
});

lifepolicyRouter.post('/api/insured/:insuredId/lifepolicy', jsonParser, (req, res, next) => {
  debug('POST: /api/insured/:insuredId/lifepolicy');

  Insured.findByIdAndAddLifePolicy(req.params.insuredId, req.body)
    .then( lifepolicy => res.json(lifepolicy))
    .catch( err => {
      err = createError(404, err.message);
      next(err);
    });
});

lifepolicyRouter.put('/api/lifepolicy/:lifepolicyId', jsonParser, (req, res, next) => {
  debug('PUT: /api/lifepolicy/:lifepolicyId');

  LifePolicy.findByIdAndUpdate(req.params.lifepolicyId, req.body, { new: true})
    .then( lifepolicy => res.json(lifepolicy))
    .catch( err => {
      if(err.name === 'ValidationError') return next(err);
      next(createError(404, err.message));
    });
});

lifepolicyRouter.delete('/api/insured/:insuredId/lifepolicy/:lifepolicyId', (req, res, next) => {
  debug('DELETE: /api/insured/:insuredId/lifepolicy/:lifepolicyId');

  Insured.findByIdAndRemoveLifePolicy(req.params.insuredId, req.params.lifepolicyId)
    .then( () => res.status(204).send())
    .catch( err => {
      err = createError(404, err.message);
      next(err);
    });
});