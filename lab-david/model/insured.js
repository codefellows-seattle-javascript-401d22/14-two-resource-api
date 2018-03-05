'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('insurance:insured');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const LifePolicy = require('./lifepolicy.js');

const insuredSchema = Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  dateofbirth: {type: Date, required: true},
  gender: {type: String, requried: true},
  lifepolicies: [{type: Schema.Types.ObjectId, ref: 'lifepolicy'}],
});

const Insured = module.exports = mongoose.model('insured', insuredSchema);

Insured.findByIdAndAddLifePolicy = function(id, lifepolicy){
  debug('findByIdAndAddLifePolicy');

  return Insured.findById(id)
    .then(insured => {
      lifepolicy.primary_insuredId = insured._id;
      this.tempInsured = insured;
      return new LifePolicy(lifepolicy).save();
    }).then(lifepolicy => {
      this.tempInsured.lifepolicies.push(lifepolicy._id);
      this.tempLifePolicy = lifepolicy;
      return this.tempLifePolicy.save();
    }).then( () => this.tempLifePolicy)
    .catch( err => Promise.reject(createError(404, err.message)));
};

Insured.findByIdAndRemoveLifePolicy = function(insuredId, lifepolicyId){
  debug('findByIdAndRemoveLifePolicy');

  return Insured.findById(insuredId)
    .then( insured => {
      this.tempInsured = insured;
      let index = this.tempInsured.lifepolicies.indexOf(lifepolicyId);
      this.tempInsured.lifepolicies.splice(index, 1);
      this.tempInsured.save();
      return LifePolicy.findByIdAndRemove(lifepolicyId);
    })
    .catch( err => Promise.reject(createError(404, err.message)));
};