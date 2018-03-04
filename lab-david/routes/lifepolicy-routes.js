'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('insurance:lifepolicy-routes');
const Insured = require('../model/insured.js');

const lifepolicyRouter = module.exports = new Router();