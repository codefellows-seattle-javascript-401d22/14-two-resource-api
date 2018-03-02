'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('recipe:recipe-router');
const List = require('../model/list.js');
const Recipe = require('../model/recipe.js');
const createError = require('http-errors');
const recipeRouter = module.exports = new Router();

recipeRouter.get('/api/recipe/:recipeId', function(req, res, next) {
  debug('GET: /api/recipe/:recipeId');

  Recipe.findById(req.params.recipeId)
    .populate('recipes')
    .then( recipe => res.json(recipe))
    .catch( err => {
      createError(404, err.message);
      next();
    });
});

recipeRouter.post('/api/list/:listId/recipe', jsonParser, function(req, res, next) {
  debug('POST: /api/list/:listId/recipe');

  List.findByIdAndAddRecipe(req.params.listId, req.body)
    .then( recipe => res.json(recipe))
    .catch( err => next(err));
});