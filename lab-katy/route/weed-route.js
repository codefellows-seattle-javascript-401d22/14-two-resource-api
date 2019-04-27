'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('weed:weed-router');
const List = require('../model/list.js');

const weedRouter = module.exports = new Router();

weedRouter.post('/api/list/:listId/weed', jsonParser, function(req, res, next) {
  debug('POST /api/list/:listId/weed');

  List.findByIdAndAddWeed(req.params.listId, req.body)
    .then( weed => res.json(weed))
    .catch(next);
});

