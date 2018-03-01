'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('recipe:recipe-router');
const List = require('../model/list.js');
const createError = require('http-errors');
const recipeRouter = module.exports = new Router();

recipeRouter.post('/api/list/:listId/recipe', jsonParser, function(req, res, next) {
  debug('POST: /api/list/:listId/recipe');

  List.findByIdAndAddRecipe(req.params.listId, req.body)
    .then( recipe => res.json(recipe))
    .catch( err => next(err));
});