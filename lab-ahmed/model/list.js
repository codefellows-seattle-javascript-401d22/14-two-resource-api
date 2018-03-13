'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('car:list');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Car = require('./car.js');

const listSchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  cars: [{ type: Schema.Types.ObjectId, ref: 'car' }],
});

const List = module.exports = mongoose.model('list', listSchema);

List.findByIdAndAddCar = function(id, car) {
  debug('findByIdAndAddCar');

  return List.findById(id)
    .catch( err => Promise.reject(createError(404, err.message)))
    .then( list => {
      car.listID = list._id;
      this.tempList = list;
      return new Car(car).save();
    })
    .then( car => {
      this.tempList.cars.push(car._id);
      this.tempCar = car;
      return this.tempList.save();
    })
    .then( () => {
      return this.tempCar;
    });
};