'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('insurance:server');
const insuredRouter = require('./routes/insured-routes.js');
const lifepolicyRouter = require('./routes/lifepolicy-routes.js');
const illustrationRouter = require('./routes/illustration-routes.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/insurancedb';

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(insuredRouter);
app.use(lifepolicyRouter);
app.use(illustrationRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug('server up on', PORT);
});

server.isRunning = true;