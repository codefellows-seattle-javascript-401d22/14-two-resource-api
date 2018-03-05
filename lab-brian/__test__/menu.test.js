'use strict';

const request = require('superagent');
const Menu = require('../model/menu.js');
const PORT = process.env.PORT || 3000;
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');

require('jest');

const url = `http://localhost:${PORT}`;
const exampleMenu = {
  name: 'example menu name',
};

describe('Menu routes', function() {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });

  afterAll(done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: api/menu', function() {
    describe('With a valid req.body', function() {
      afterEach(done => {
        if(this.tempMenu) {
          Menu.remove({})
            .then(() => done())
            .catch(done);
          return;
        }
        done();
      });

      it('Should return a menu', done => {
        request.post(`${url}/api/menu`)
          .send(exampleMenu)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual('example menu name');
            this.tempMenu = res.body;
            done();
          });
      });
    });
  });

  describe('GET: api/menu:menuID', function() {
    describe('With a valid body', function() {
      beforeEach(done => {
        exampleMenu.timestamp = new Date();
        new Menu(exampleMenu).save()
          .then( menu => {
            this.tempMenu = menu;
            done();
          })
          .catch(done);
      });
      afterEach(done => {
        delete exampleMenu.timestamp;
        if(this.tempMenu) {
          Menu.remove({})
            .then( () => done())
            .catch(done);
          return;
        }
        done();
      });

      it('Should return a menu', done => {
        request.get(`${url}/api/menu/${this.tempMenu._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual('example menu name');
            done();
          });
      });
    });
  });

});