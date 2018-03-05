'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('entree:entree-route');
const Menu = require('../model/menu.js');

const entreeRouter = module.exports = new Router();

// http POST :3000/api/menu/5a9ced3a6707472fa2474206/entree name=pizza price=20
entreeRouter.post('/api/menu/:menuID/entree', jsonParser, function(req, res, next) {
  debug('POST: /api/menu/:menuID/entree');

  Menu.findByIdAndAddEntree(req.params.menuID, req.body)
    .then ( entree => res.json(entree))
    .catch(next);
});