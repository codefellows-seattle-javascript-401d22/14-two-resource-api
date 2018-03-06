'use strict';

const superagent = require('superagent');
const Doggo = require('../model/doggo.js');
const Toy = require('../model/fav-toys.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;

const exampleToy = {
  name: 'spikey evil ring thing that everyone hates',
  color: 'yellow',
};

const exampleDoggo = {
  name: 'chloe the perfect pitbull',
  age: 4,
};

describe('Toy Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
    console.log('server down');
  });

  describe('POST: /api/doggo/:id/toy', function() {
    describe('with a valid doggo id and toy body', () => {
      beforeEach(done => {
        new Doggo(exampleDoggo).save()
          .then( doggo => {
            this.tempDoggo = doggo;
            done();
          })
          .catch(done);
      });

      afterEach( done => {
        Promise.all([
          Doggo.remove({}),
          Toy.remove({}),
        ])
          .then( () => done())
          .catch(done);
      });

      it('should return a toy', done => {
        superagent.post(`${url}/api/doggo/${this.tempDoggo._id}/toy`)
          .send(exampleToy)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.name).toEqual(exampleToy.name);
            expect(res.body.doggoID).toEqual(this.tempDoggo._id.toString());
            done();
          });
      });
    });
  });
});