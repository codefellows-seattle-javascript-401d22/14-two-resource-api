'use strict';

const debug = require('debug')('insurance:server-toggle');
const PORT = process.env.PORT || 3000;

module.exports = exports = {};

exports.serverOn = function(server, done){
  if(!server.isRunning){
    server.listen(PORT, () => {
      server.isRunning = true;
      debug('server up!');
      done();
    });
    return;
  }
  done();
};

exports.serverOff = function(server, done){
  if(server.isRunning){
    server.close(err => {
      if(err) return done(err);
      server.isRunning = false;
      debug('server down!');
      done();
    });
    return;
  }
  done();
};