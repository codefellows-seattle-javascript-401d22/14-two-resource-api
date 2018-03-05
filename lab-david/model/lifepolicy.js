'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('insurance:lifepolicy');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Illustration = require('./illustration.js');

const lifepolicySchema = Schema({
  policynumber: {type: String, required: true},
  ins_carrier: {type: String, required: true},
  death_benefit: {type: Number, required: true},
  primary_insuredId: {type: Schema.Types.ObjectId, required: true},
  secondary_insuredId: Schema.Types.ObjectId,
  illustrations: [{type: Schema.Types.ObjectId, ref: 'illustration'}],
});

const LifePolicy = module.exports = mongoose.model('lifepolicy', lifepolicySchema);

LifePolicy.findByIdAndAddIllustration = function(id, illustration){
  debug('findByIdAndAddIllustration');

  return LifePolicy.findById(id)
    .then(lifepolicy => {
      illustration.lifepolicyId = lifepolicy._id;
      this.tempLifePolicy = lifepolicy;
      return new Illustration(illustration).save();
    }).then( illustration => {
      this.tempLifePolicy.illustrations.push(illustration._id);
      this.tempIllustration = illustration;
      return this.tempIllustration.save();
    }).then( () => this.tempIllustration)
    .catch( err => Promise.reject(createError(404, err.message)));
};