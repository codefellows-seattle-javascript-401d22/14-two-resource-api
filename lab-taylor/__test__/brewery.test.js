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

const updateBrewery = {
  name: 'update name',
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

    it('should return a 400', done => {
      request.post(`${url}/api/brewery/`)
        .send({})
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(err.message).toEqual('Bad Request');
          done();
        });
    });

  });
  describe('GET: /api/brewery/:breweryId', function () {
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
    
    describe('with a valid body', () => {
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
    describe('with an invalid body', () => {
      it('should return a 404 status', done => {
        request.get(`${url}/api/brewery/1234`)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(err.message).toEqual('Not Found');
            done();
          });
      });
    });
  });
  describe('PUT: /api/brewery/breweyId', function() {
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
    describe('with a valid body', () => {
      it('should update an existing brewey', done => {
        request.put(`${url}/api/brewery/${this.tempBrewery._id}`)
          .send(updateBrewery)
          .end((err, res) => {
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(updateBrewery.name);
            done();
          });
      });
    });
    describe('without a valid id', () => {
      it('should return a 404 status', done => {
        request.put(`${url}/api/brewery/123456`)
          .send(updateBrewery)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(err.message).toEqual('Not Found');
            done();
          });
      });
    });
    describe('without a valid body', () => {
      it('should return a 400 status', done => {
        request.put(`${url}/api/brewery/${this.tempBrewery._id}`)
          .send({})
          .end((err, res) => {
            expect(res.status).toEqual(400);
            expect(err.message).toEqual('Bad Request');
            done();
          });
      });
    });
  });
  describe('DELETE: /api/brewery/breweryId', function() {
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
    describe('with a valid id', () => {
      it('should delete a brewery', done => {
        request.delete(`${url}/api/brewery/${this.tempBrewery._id}`)
          .end((err, res) => {
            expect(res.status).toEqual(204);
            done();
          });
      });
    });
  });
});