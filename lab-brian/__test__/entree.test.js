'use strict';

const request = require('superagent');
const Menu = require('../model/menu.js');
const Entree = require('../model/entree.js');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;

const exampleEntree = {
  name: 'example entree name',
  price: 100,
};

const exampleMenu = {
  name: 'example menu name',
  timestamp: new Date(),
};

describe('Entree routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/menu/:menuID/entree', function() {
    describe('with a valid menu ID and req.body', () => {
      beforeEach( done => {
        new Menu(exampleMenu).save()
          .then( menu => {
            this.tempMenu = menu;
            done();
          })
          .catch(done);
      });
      afterEach( done => {
        Promise.all([
          Menu.remove({}),
          Entree.remove({}),
        ])
          .then( () => done())
          .catch(done);
      });

      it('Should return an entree', done => {
        request.post(`${url}/api/menu/${this.tempMenu._id}/entree`)
          .send(exampleEntree)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.name).toEqual(exampleEntree.name);
            expect(res.body.menuID).toEqual(this.tempMenu._id.toString());
            done();
          });
      });

      it('Should return a 400 error', done => {
        request.post(`${url}/api/menu/${this.tempMenu._id}/entree`)
          .send()
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });

      it('Should return a 404 error', done => {
        request.post(`${url}/api/menu/a979e472c577c679758e018/entree`)
          .send(exampleEntree)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });

    });
  });
});