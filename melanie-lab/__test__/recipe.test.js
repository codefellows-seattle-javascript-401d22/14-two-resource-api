'use strict';

const request = require('superagent');
const List = require('../model/list.js');
const Recipe = require('../model/recipe.js');
const PORT = process.env.PORT || 3000;
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = `http://localhost:${PORT}`;

const exampleRecipe = {
  name: 'Test recipe name',
  prepTime: '20 min',
  cookTime: '30 min',
};

const exampleList = {
  name: 'Test recipe list',
  timestamp: new Date(),
};

describe('Recipe Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/list/:listId/recipe', function() {
    describe('with a valid list id & recipe body', () => {
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
          Recipe.remove({}),
        ])
          .then( () => done())
          .catch(done);
      });
      it.only('should return a recipe', done => {
        request.post(`${url}/api/list/${this.tempList._id}/recipe`)
          .send(exampleRecipe)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.name).toEqual(exampleRecipe.name);
            expect(res.body.listId).toEqual(this.tempList._id.toString());
            done();
          });
      });
    });
  });
});