'use strict';

const request = require('superagent');
const List = require('../model/list.js');
const Car = require('../model/car.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;

const exampleCar = {
  name: 'test car',
  content: 'test car content',
};

const exampleList = {
  name: 'example list',
  timestamp: new Date(),
};

describe('Car Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/list/:listId/car', function() {
    describe('with a valid list id and car body', () => {
      beforeEach( done => {
        new List(exampleList).save()
          .then( list => {
            this.tempList = list;
            done();
          })
          .catch(done);
      });
      afterEach( done => {
        Promise.all([
          List.remove({}),
          Car.remove({}),
        ])
          .then( () => done())
          .catch(done);
      });
      it('should return a car', done => {
        request.post(`${url}/api/list/${this.tempList._id}/car`)
          .send(exampleCar)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(exampleCar.name);
            expect(res.body.listID).toEqual(this.tempList._id.toString());
            done();
          });
      });
    });
    describe('without a valid list id', () => {
      it('should return a 404 error', done => {
        request.post(`${url}/api/list/12345/car`)
          .send(exampleCar)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(res.body.text).toEqual();
            done();
          });
      });
    });
  });
});