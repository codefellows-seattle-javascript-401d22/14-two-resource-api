'use strict';

const Router = require('express').Router;
const bodyParser = require('body-parser').json();
const debug = require('debug')('doggo:doggo-route');
const Doggo = require('../model/doggo.js');
const createError = require('http-errors');
const router = new Router();

router.get('/api/doggo/:id', function(req, res, next) {
  debug('GET /api/doggo/:id');

  Doggo.findById(req.params.id)
    .populate('toys')
    .then(doggo => {
      if (!doggo) return next(createError(404));
      res.json(doggo);
    })
    .catch( err => {
      console.error(err);
      next(createError(400));
    });
});

router.post('/api/doggo', bodyParser, function(req, res, next) {
  debug('POST: /api/doggo/');
  if (req.body.name === undefined || req.body.age === undefined) {
    next(createError(400));
    return;
  }

  new Doggo(req.body).save()
    .then( doggo => res.json(doggo))
    .catch(next);
});

router.put('/api/doggo/:id', bodyParser, function(req, res, next) {
  debug('PUT: /api/doggo/:id');
  if (req.body.name === undefined || req.body.age === undefined) {
    next(createError(400));
    return;
  }
  
  Doggo.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then( doggo => res.json(doggo))
    .catch( err => {
      if(err.name === 'ValidationError') return next(err);
      next(createError(404));
    });
  
});

router.delete('/api/doggo/:id', function(req, res) {
  debug('DELETE: /api/doggo/:id');
  console.log('delete id', req.params.id);

  Doggo.findByIdAndRemove(req.params.id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch( err => next(createError(404, err.message)));
});

router.get('/api/:anything', function(req, res) {
  res.sendStatus(404);
});

module.exports = router;