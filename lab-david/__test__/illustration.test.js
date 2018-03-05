'use strict';

const request = require('superagent');
const Illustration = require('../model/illustration.js');
const LifePolicy = require('../model/lifepolicy');
const Insured = require('../model/insured.js');
const serverToggle = require('../lib/server-toggle');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

require('jest');

const url = `http://localhost:${PORT}`;

const exampleIllustration = {
  date: new Date(),
  premiums_until_age: 100,
  inforce_until_age: 120,
  annualized_premiums: 30000,
};

const exampleLifePolicy = {
  policynumber: '1234abc',
  ins_carrier: 'Prudential',
  death_benefit: 1000000,
};

const exampleInsured = {
  first_name: 'first',
  last_name: 'last',
  dateofbirth: new Date('03/16/1983'),
  gender: 'M',
};

describe('Illustration Routes', function(){
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });

  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/lifepolicy/:lifepolicyId/illustration', function(){
    describe('with a valid lifepolicy id and illustration', function(){
      beforeEach( done => {
        new Insured(exampleInsured).save()
          .then(insured => {
            this.tempInsured = insured;
            return Insured.findByIdAndAddLifePolicy(this.tempInsured._id, exampleLifePolicy);
          }).then(lifepolicy => {
            this.tempLifePolicy = lifepolicy;
            done();
          }).catch(done);
      });

      afterEach( done => {
        Promise.all([
          Insured.remove({}),
          LifePolicy.remove({}),
          Illustration.remove({}),
        ]).then( () => done())
          .catch(done);
      });

      it('should return an illustration', done => {
        request.post(`${url}/api/lifepolicy/${this.tempLifePolicy._id}/illustration`)
          .send(exampleIllustration)
          .end((err,res) => {
            if(err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.premiums_until_age).toEqual(exampleIllustration.premiums_until_age);
            expect(res.body.inforce_until_age).toEqual(exampleIllustration.inforce_until_age);
            expect(res.body.death_benefit).toEqual(exampleIllustration.death_benefit);
            expect(res.body.lifepolicyId).toEqual(this.tempLifePolicy._id.toString());
            done();
          });
      });
    });
    describe('with an invalid lifepolicy id and/or illustration', function(){
      it('should return a 404 error', done => {
        request.post(`${url}/api/lifepolicy/123/illustration`)
          .send(exampleIllustration)
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });
});