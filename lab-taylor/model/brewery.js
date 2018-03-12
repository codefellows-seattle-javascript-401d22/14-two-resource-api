'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('beer:brewery');
const createError = require('http-errors');
const Beer = require('./beer.js');

const brewerySchema = Schema({
  name: {type: String, required: true},
  timestamp: { type: Date, required: true},
  beers: [{ type: Schema.Types.ObjectId, ref: 'beer'}],
});

const Brewery = module.exports = mongoose.model('brewery', brewerySchema);

Brewery.findByIdAndAddBeer = function(id, beer) {
  debug('findByIdAndAddBeer');

  return Brewery.findById(id)
    .then( brewery => {
      beer.breweryID = brewery._id;
      this.tempBrewery = brewery;
      return new Beer(beer).save();
    })
    .then( beer => {
      this.tempBrewery.beers.push(beer._id);
      this.tempBeer = beer;
      return this.tempBrewery.save();
    })
    .then( () => {
      return this.tempBeer;
    })
    .catch( err => Promise.reject(createError(404, err.message)));

};



