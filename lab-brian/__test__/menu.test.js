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

      it('should return a 400 error', done => {
        request.post(`${url}/api/menu`)
          .send()
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });

    });
  });

  describe('GET: api/menu:menuID', function() {
    describe('With a valid body', function() {
      beforeAll(done => {
        exampleMenu.timestamp = new Date();
        new Menu(exampleMenu).save()
          .then( menu => {
            this.tempMenu = menu;
            done();
          })
          .catch(done);
      });
      afterAll(done => {
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

      it('Should return all menus', done => {
        request.get(`${url}/api/menu`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body[0].name).toEqual('example menu name');
            done();
          });
      });

      it('should return a 404 error', done => {
        request.get(`${url}/api/menu/a979e472c577c679758e018`)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });

    });
  });

  describe('PUT: /api/menu/:menuID', function() {
    describe('with a valid id and request body', function() {
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

      it('Should update and return a menu', done => {
        let updateMenu = {name: 'updated name'};
        updateMenu.timestamp = '2018-03-01T09:37:08.000Z';
        request.put(`${url}/api/menu/${this.tempMenu._id}`)
          .send(updateMenu)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body._id).toEqual(this.tempMenu._id.toString());
            for(var prop in updateMenu) {
              expect(res.body[prop]).toEqual(updateMenu[prop]);
            }
            done();
          });
      });

      it('should respond with a 404', done => {
        let updateMenu = {name: 'updated name 404'};
        updateMenu.timestamp = '2018-03-01T09:37:08.000Z';
        request.put(`${url}/api/menu/404`)
          .send(updateMenu)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });

      it('should respond with a 400', done => {
        request.put(`${url}/api/menu/${this.tempMenu._id}`)
          .send( )
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          }); 
      });

      it('should respond with a 400', done => {
        let updateMenu = {name: 'updated name'};
        updateMenu.timestamp = '2018-03-01T09:37:08.000Z';
        request.put(`${url}/api/menu`)
          .send(updateMenu)
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });

    });
  });

  describe('DELETE: /api/menu/:menuID', function() {
    describe('with a valid id', function() {
      beforeEach( done => {
        exampleMenu.timestamp = new Date();
        new Menu(exampleMenu).save()
          .then( menu => {
            this.tempMenu = menu;
            done();
          })
          .catch(done);
      });

      afterEach( done => {
        delete exampleMenu.timestamp;
        if(this.tempMenu) {
          Menu.remove({})
            .then( () => done())
            .catch(done);
          return;
        }
        done();
      });

      it('should delete a menu', done => {
        request.delete(`${url}/api/menu/${this.tempMenu._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(204);
            done();
          });
      });

      it('should not delete and return a 404 error', done => {
        request.delete(`${url}/api/menu/404`)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });

      it('should not delete and return a 400 error', done => {
        request.delete(`${url}/api/menu`)
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });

});