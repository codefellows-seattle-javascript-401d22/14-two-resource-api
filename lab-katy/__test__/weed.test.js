'use strict';

const request = require('superagent');
const List = require('../model/list.js');
const Weed = require('../model/weed.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;

const exampleWeed = {
  type: 'test weed type', 
  strain: 'test weed strain',
};

const exampleList = {
  name: 'example list', 
  timestamp: new Date(),
};

describe('Weed Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  //POST ROUTE TESTING

  describe('POST: /api/list/:listId/weed', function() {
    describe('with a valid list id and weed body', () => {
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
          Weed.remove({}),
        ])
          .then( () => done())
          .catch(done);
      });


      //most basic test is status code 
      //next: all properties that come back with repsonse
      //GO SUPER HAM check typeof thing, other methods like deep properties and types of data you're looking at

      it('should return weed', done => {
        request.post(`${url}/api/list/${this.tempList._id}/weed`)
          .send(exampleWeed)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.name).toEqual(exampleWeed.name);
            expect(res.body.listID).toEqual(this.tempList._id.toString()); 
            done();
          });
      });
    });
  });
});