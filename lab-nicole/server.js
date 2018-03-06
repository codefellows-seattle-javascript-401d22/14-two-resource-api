'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('doggo:server');
const doggoRouter = require('./route/doggo-route.js');
const toyRouter = require('./route/toy-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017/doggodb';

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(doggoRouter);
app.use(toyRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`listening on ${PORT}`);
});

server.isRunning = true;