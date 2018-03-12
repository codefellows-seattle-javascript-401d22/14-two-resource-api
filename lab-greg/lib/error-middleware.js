'use strict';

const createError = require('http-errors');
const debug = require('debug')('song:error-middleware');

module.exports = function(err, req, next) {
  debug('error middeware');

  console.error('message', err.message); //where is the error message coming from?
  console.error('name:', err.name);

  if (err.status) {
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if (err.name === 'ValidationError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};