'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('car:server');
const listRouter = require('./route/list-route.js');
const carRouter = require('./route/car-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/carsdb';

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(listRouter);
app.use(carRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});

server.isRunning = true;