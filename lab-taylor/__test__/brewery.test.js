'use strict';

const request = require('superagent');
const Brewery = require('../model/brewery.js');
const PORT = process.env.PORT || 3000;

const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = `http://localhost:${PORT}`;
const exampleBrewery = {
  name: 'test brewery name',
};

describe('Brewery Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });
  describe('POST: /api/brewery', function() {
    afterEach( done => {
      if(this.tempBrewery) {
        Brewery.remove({})
          .then( () => done())
          .catch(done);
        return;
      }
      done();
    });

    it('should return a brewery', done => {
      request.post(`${url}/api/brewery`)
        .send(exampleBrewery)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual('test brewery name');
          this.tempBrewery = res.body;
          done();
        });
    });

  });
  describe('GET: /api/brewery/:breweryId', function () {
    describe('with a valid body', function() {
      beforeEach( done => {
        exampleBrewery.timestamp = new Date();
        new Brewery(exampleBrewery).save()
          .then( brewery => {
            this.tempBrewery = brewery;
            done();
          })
          .catch(done);
      });

      afterEach( done => {
        delete exampleBrewery.timestamp;
        if(this.tempBrewery) {
          Brewery.remove({})
            .then( () => done())
            .catch(done);
          return;
        }
        done();
      });

      it('should return a brewery', done => {
        request.get(`${url}/api/brewery/${this.tempBrewery._id}`)
          .end((err,res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            
            expect(res.body.name).toEqual('test brewery name');
            done();
          });
      });
    });
  });
});