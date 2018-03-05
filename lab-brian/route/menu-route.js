'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('entree:menu-route');
const createError = require('http-errors');
const Menu = require('../model/menu.js');
const menuRouter = module.exports = new Router();

// http :3000/api/menu/5a9ced3a6707472fa2474206
menuRouter.get('/api/menu/:menuID', function(req, res, next) {
  debug('GET: /api/menu/:menuID');

  Menu.findById(req.params.menuID)
    .populate('entrees')
    .then( menu => res.json(menu))
    .catch( err => {
      err = createError(404, 'Not Found');
      next(err);
    });
});

// http :3000/api/menu
menuRouter.get('/api/menu', function(req, res, next) {
  debug('GET: /api/menu');

  Menu.find()
    .populate('entrees')
    .then( menus => res.json(menus))
    .catch( err => next(err));
});

// http POST :3000/api/menu name=brunch
menuRouter.post('/api/menu', jsonParser, function(req, res, next) {
  debug('POST: /api/menu');
  if (!req.body.name) return next(createError(400, 'expected a request body name'));

  req.body.timestamp = new Date();
  new Menu(req.body).save()
    .then( menu => res.json(menu))
    .catch(next);
});

// http PUT :3000/api/menu/5a9ced3a6707472fa2474206 name=dinner
menuRouter.put('/api/menu/:menuID', jsonParser, function(req, res, next) {
  debug('PUT: /api/menu:menuID');
  if (!req.body.name) return next(createError(400, 'expected a request body name'));

  Menu.findByIdAndUpdate(req.params.menuID, req.body, {new: true})
    .then( menu => res.json(menu))
    .catch( err => {
      if(err.name === 'ValidationError') return next(err);
      next(createError(404, err.message));
    });
});

// http PUT :3000/api/menu name=lunch
menuRouter.put('/api/menu', function(req, res, next) {
  debug('PUT: /api/menu');
  return next(createError(400, 'expected menuID'));
});

// http DELETE :3000/api/menu/5a9cedc56707472fa2474207
menuRouter.delete('/api/menu/:menuID', function(req, res, next) {
  debug('DELETE /api/menu:menuID');

  Menu.findByIdAndRemove(req.params.menuID)
    .then( () => res.status(204).send())
    .catch( err => next(createError(404, err.message)));
});

// http DELETE :3000/api/menu
menuRouter.delete('/api/menu', function(req, res, next) {
  debug('DELETE: /api/menu');
  return next(createError(400, 'expected menuID'));
});
