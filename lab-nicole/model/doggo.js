'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Toy = require('./fav-toys.js');
const debug = require('debug')('doggo:doggo');
const createError = require('http-errors');

const doggoSchema = Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  toys: [{type: Schema.Types.ObjectId, ref:'toy'}],
});

const Doggo = module.exports = mongoose.model('doggo', doggoSchema);

Doggo.findByIdAndAddToy = function(id, toy) {
  debug('findByIdAndAddToy');

  return Doggo.findById(id)
    .then(doggo => {
      toy.doggoID = doggo._id;
      this.tempDoggo = doggo;
      return new Toy(toy).save();
    })
    .then( toy => {
      this.tempDoggo.toys.push(toy._id);
      this.tempToy = toy;
      return this.tempDoggo.save();
    })
    .then( () => {
      return this.tempToy;
    })
    .catch( err => Promise.reject(createError(404, err.message)));
};

