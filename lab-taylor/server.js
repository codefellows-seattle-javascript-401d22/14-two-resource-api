'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('beer:server');
const breweryRouter = require('./routes/brewery-route.js');
const beerRouter = require('./routes/beer-route.js');
const errors = require('./lib/err-middleware.js');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/beersdb';
const app = express();

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(breweryRouter);
app.use(beerRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`Server listening on ${PORT}`);
});

server.isRunning = true;