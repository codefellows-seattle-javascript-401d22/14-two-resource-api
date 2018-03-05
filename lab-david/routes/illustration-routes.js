'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('insurance:lifepolicy-routes');
const LifePolicy = require('../model/lifepolicy.js');

const illustrationRouter = module.exports = new Router();

illustrationRouter.post('/api/lifepolicy/:lifepolicyId/illustration', jsonParser, (req, res, next) => {
  debug('POST: /api/lifepolicy/:lifepolicyId/illustration');

  LifePolicy.findByIdAndAddIllustration(req.params.lifepolicyId, req.body)
    .then( illustration => res.json(illustration))
    .catch(next);
});