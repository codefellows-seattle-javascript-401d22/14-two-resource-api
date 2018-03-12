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

const updateBeer = {
  name: 'update beer',
  style: 'update style',
};

describe('Beer Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/brewery/:breweryId/beer', function() {
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
    
    describe('with a valid brewery id and beer body', () => {
      it('should return a beer', done => {
        request.post(`${url}/api/brewery/${this.tempBrewery._id}/beer`)
          .send(exampleBeer)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(exampleBeer.name);
            expect(res.body.breweryID).toEqual(this.tempBrewery._id.toString());
            done();
          });
      });
    });
    describe('without a valid body', () => {
      it('should return a 400', done => {
        request.post(`${url}/api/brewery/${this.tempBrewery._id}/beer`)
          .send({})
          .end((err, res) => {
            expect(res.status).toEqual(400);
            expect(err.message).toEqual('Bad Request');
            done();
          });
      });
    });
  });
  describe('GET: /api/beer/beerId', function() {
    beforeEach( done => {
      new Brewery(exampleBrewery).save()
        .then( brewery => {
          this.tempBrewery = brewery;
          done();
        })
        .catch(done);
    });

    beforeEach( done => {
      new Beer(exampleBeer).save()
        .then( beer => {
          this.tempBeer = beer;
          
          done();
        })
        .catch(done);
    });
      
    
    afterAll( done => {
      Promise.all([
        Brewery.remove({}),
        Beer.remove({}),
      ])
        .then( () => done())
        .catch(done);
    });
    describe('with a valid id', () => {
      it('should return a beer', done => {
        request.get(`${url}/api/beer/${this.tempBeer._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(exampleBeer.name);
            expect(res.body.style).toEqual(exampleBeer.style);
            done();
          });
      });
    });
    describe('without a valid id', () => {
      it('should return a 404 status', done => {
        request.get(`${url}/api/beer/12345`)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(err.message).toEqual('Not Found');
            done();
          });
      });
    });
  });
  describe('PUT /api/beer/beerId', () => {
    beforeEach( done => {
      new Brewery(exampleBrewery).save()
        .then( brewery => {
          this.tempBrewery = brewery;
          done();
        })
        .catch(done);
    });

    beforeEach( done => {
      new Beer(exampleBeer).save()
        .then( beer => {
          this.tempBeer = beer;
          
          done();
        })
        .catch(done);
    });
      
    
    afterAll( done => {
      Promise.all([
        Brewery.remove({}),
        Beer.remove({}),
      ])
        .then( () => done())
        .catch(done);
    });
    describe('with a valid body', () => {
      it('should update an existing beer', done => {
        request.put(`${url}/api/beer/${this.tempBeer._id}`)
          .send(updateBeer)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.name).toEqual(updateBeer.name);
            expect(res.body.style).toEqual(updateBeer.style);
            done();
          });
      });
    });
    describe('with an invalid body', () => {
      it('should return a 400 status', done => {
        request.put(`${url}/api/beer/${this.tempBeer._id}`)
          .send({})
          .end((err, res) => {
            expect(res.status).toEqual(400);
            expect(err.message).toEqual('Bad Request');
            done();
          });
      }); 
    });
    describe('with an invalid Id', () => {
      it('should return a 404 status', done => {
        request.put(`${url}/api/beer/12345`)
          .send(updateBeer)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            expect(err.message).toEqual('Not Found');
            done();
          }); 
      });
    });
  });
  describe('DELETE /api/beer/beerId', function() {
    beforeEach( done => {
      new Brewery(exampleBrewery).save()
        .then( brewery => {
          this.tempBrewery = brewery;
          done();
        })
        .catch(done);
    });

    beforeEach( done => {
      new Beer(exampleBeer).save()
        .then( beer => {
          this.tempBeer = beer;
          
          done();
        })
        .catch(done);
    });
      
    
    afterAll( done => {
      Promise.all([
        Brewery.remove({}),
        Beer.remove({}),
      ])
        .then( () => done())
        .catch(done);
    });
    describe('with a valid id', () => {
      it('should return a 204', done => {
        request.delete(`${url}/api/beer/${this.tempBeer._id}`)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).toEqual(204);
            done();
          });
      });
    });
  });
});
        