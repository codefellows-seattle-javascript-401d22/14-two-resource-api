'use strict';

const request = require('superagent');
const Song = require('../model/song.js');
const PORT = process.env.PORT || 3000;
//const mongoose = require('mongoose');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = `http://localhost:${PORT}`;
const exampleSong = {
  name: 'test song name',
};

describe('Song Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/song', function() {
    describe('with a valid req body', function() {
      afterEach( done => {
        if (this.tempSong) {
          Song.remove({})
            .then( () => done())
            .catch(done);
          return;
        }
        done();
      });

      it('should return a song', done => {
        request.post(`${url}/api/song`)
          .send(exampleSong)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual('test song name');
            this.tempSong = res.body;
            done();
          });
      });
    });
  });

  describe('GET: /api/song/:songId', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        exampleSong.timestamp = new Date();
        new Song(exampleSong).save()
          .then( song => {
            this.tempSong = song;
            done();
          })
          .catch(done);
      });

      afterEach( done => {
        delete exampleSong.timestamp;
        if (this.tempSong) {
          Song.remove({})
            .then( () => done())
            .catch(done);
          return;
        }
        done();
      });

      it('should return a song', done => {
        request.get(`${url}/api/song/${this.tempSong._id}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual('test song name');
            done();
          });
      });
    });
  });
});