'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('entree:server');
const menuRouter = require('./route/menu-route.js');
const entreeRouter = require('./route/entree-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/entreesdb';

mongoose.connect(MONGODB_URI);
app.use(cors());
app.use(morgan('dev'));

app.use(menuRouter);
app.use(entreeRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});

server.isRunning = true;