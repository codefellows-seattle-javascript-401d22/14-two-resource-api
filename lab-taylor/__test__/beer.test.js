'use strict';

const request = require('superagent');
const Brewery = require('../model/brewery.js');
const Beer = require('../model/beer.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;

const exampleBeer = {
  name: 'test beer',
  style: 'test beer style',
};

const exampleBrewery = {
  name: 'example brewery',
  timestamp: new Date(),
};

describe('Beer Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/brewery/:breweryId/beer', function() {
    describe('with a valid brewery id and beer body', () => {
      beforeEach( done => {
        new Brewery(exampleBrewery).save()
          .then( brewery => {
            this.tempBrewery = brewery;
            done();
          })
          .catch(done);
      });

      afterEach( done => {
        Promise.all([
          Brewery.remove({}),
          Beer.remove({}),
        ])
          .then( () => done())
          .catch(done);
      });

      it('should return a beer', done => {
        request.post(`${url}/api/brewery/${this.tempBrewery._id}/beer`)
          .send(exampleBeer)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.name).toEqual(exampleBeer.name);
            expect(res.body.breweryID).toEqual(this.tempBrewery._id.toString());
            done();
          });
      });
    });
  });
});