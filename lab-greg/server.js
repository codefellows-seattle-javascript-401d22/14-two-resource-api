'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const debug = require('debug')('song:server');
const songlistRouter = require('./route/songlist-route.js');
const songRouter = require('./route/song-route.js');
const errors = require('./lib/error-middleware.js');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost/notesdb';

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(songlistRouter);
app.use(songRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});

server.isRunning = true;