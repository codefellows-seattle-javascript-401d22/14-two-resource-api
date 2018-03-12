'use strict';

const createError = require('http-errors');
const debug = require('debug')('beer:errors');

module.exports = function(err, req, res, next) {
  debug('error middleware');

  if(err.status) {
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.message.includes('ObjectId failed')) {
    err = createError(404, 'Not Found');
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'ValidationError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};

