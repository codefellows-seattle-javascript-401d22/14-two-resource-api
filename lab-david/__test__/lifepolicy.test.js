'use strict';

const request = require('superagent');
const LifePolicy = require('../model/lifepolicy');
const Insured = require('../model/insured.js');
const serverToggle = require('../lib/server-toggle');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;


const exampleLifePolicy = {
  policynumber: '1234abc',
  ins_carrier: 'Prudential',
  death_benefit: 1000000,
};

const updatedLifePolicy = {
  policynumber: 'abc',
  ins_carrier: 'Met Life',
  death_benefit: 2000000,
};

const exampleInsured = {
  first_name: 'first',
  last_name: 'last',
  dateofbirth: new Date('03/16/1983'),
  gender: 'M',
};

describe('Life Policy Routes', function(){
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('GET: /api/lifepolicy/:lifepolicyId', function(){
    describe('with a valid id', function(){
      beforeEach( done => {
        new Insured(exampleInsured).save()
          .then(insured => {
            this.tempInsured = insured;
            return Insured.findByIdAndAddLifePolicy(this.tempInsured._id, exampleLifePolicy);
          }).then(lifepolicy => {
            this.tempLifePolicy = lifepolicy;
            done();
          });
      });

      afterEach( done => {
        Promise.all([
          Insured.remove({}),
          LifePolicy.remove({}),
        ]).then( () => done())
          .catch(done);
      });

      it('should return a life policy', done => {
        request.get(`${url}/api/lifepolicy/${this.tempLifePolicy._id}`)
          .end((err,res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.policynumber).toEqual(exampleLifePolicy.policynumber);
            expect(res.body.ins_carrier).toEqual(exampleLifePolicy.ins_carrier);
            expect(res.body.death_benefit).toEqual(exampleLifePolicy.death_benefit);
            done();
          });
      });
    });
  });
  describe('with an invalid id', function(){
    it('should return a 404 error', done => {
      request.get(`${url}/api/lifepolicy/123`)
        .end((err,res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });

  describe('POST: /api/insured/:insuredId/lifepolicy', function(){
    describe('with a valid insured id and life policy', function(){
      beforeEach( done => {
        new Insured(exampleInsured).save()
          .then(insured => {
            this.tempInsured = insured;
            done();
          }).catch(done);
      });

      afterEach( done => {
        Promise.all([
          Insured.remove({}),
          LifePolicy.remove({}),
        ]).then( () => done())
          .catch(done);
      });

      it('should return a life policy', done => {
        request.post(`${url}/api/insured/${this.tempInsured._id}/lifepolicy`)
          .send(exampleLifePolicy)
          .end((err,res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.policynumber).toEqual(exampleLifePolicy.policynumber);
            expect(res.body.ins_carrier).toEqual(exampleLifePolicy.ins_carrier);
            expect(res.body.death_benefit).toEqual(exampleLifePolicy.death_benefit);
            done();
          });
      });
    });

    describe('with an invalid id and/or life policy', function(){
      it('should return a 404 error', done => {
        request.post(`${url}/api/insured/123/lifepolicy`)
          .send(exampleLifePolicy)
          .end((err,res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });

  describe('PUT: /api/lifepolicy/:lifepolicyId', function(){
    beforeEach( done => {
      new Insured(exampleInsured).save()
        .then( insured => {
          this.tempInsured = insured;
          return Insured.findByIdAndAddLifePolicy(this.tempInsured._id, exampleLifePolicy);
        }).then( lifepolicy => {
          this.tempLifePolicy = lifepolicy;
          done();
        });
    });

    afterEach( done => {
      Promise.all([
        Insured.remove({}),
        LifePolicy.remove({}),
      ]).then( () => done())
        .catch(done);
    });

    describe('with a valid life policy id', () => {
      it('should return an update life policy', done => {
        request.put(`${url}/api/lifepolicy/${this.tempLifePolicy._id}`)
          .send(updatedLifePolicy)
          .end((err,res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.policynumber).toEqual(updatedLifePolicy.policynumber);
            expect(res.body.ins_carrier).toEqual(updatedLifePolicy.ins_carrier);
            expect(res.body.death_benefit).toEqual(updatedLifePolicy.death_benefit);
            done();
          });
      });
    });

    describe('with an invalid life policy id', () => {
      it('should return a 404 error', done => {
        request.put(`${url}/api/lifepolicy/123`)
          .send(updatedLifePolicy)
          .end((err,res) => {
            expect(err.status).toEqual(404);
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });

  describe('DELETE: /api/lifepolicy/:lifepolicyId', function(){
    beforeEach( done => {
      new Insured(exampleInsured).save()
        .then( insured => {
          this.tempInsured = insured;
          return Insured.findByIdAndAddLifePolicy(this.tempInsured._id, exampleLifePolicy);
        }).then( lifepolicy => {
          this.tempLifePolicy = lifepolicy;
          done();
        });
    });

    afterEach( done => {
      Promise.all([
        Insured.remove({}),
        LifePolicy.remove({}),
      ]).then( () => done())
        .catch(done);
    });

    describe('with a valid life policy id', () => {
      it('should return status 204', done => {
        request.delete(`${url}/api/insured/${this.tempInsured._id}/lifepolicy/${this.tempLifePolicy._id}`)
          .end((err,res) => {
            if(err) return done(err);
            expect(res.status).toEqual(204);
            done();
          });
      });
    });

    describe('with an invalid life policy id', () => {
      it('should return a 404 error', done => {
        request.delete(`${url}/api/insured/${this.tempInsured._id}/lifepolicy/123`)
          .end((err,res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });
});