'use strict';

//can also be called schema file 

const mongoose = require('mongoose');
const debug = require('debug')('weed:list');
const createError = require('http-errors');
const Schema = mongoose.Schema;
const Weed = require('./weed.js');

//dont need new in front of Schema bc its a pseudo construtor
const listSchema = Schema({ 
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  weedz: [{ type: Schema.Types.ObjectId, ref: 'weed' }],
});  

const List = module.exports = mongoose.model('list', listSchema);

List.findByIdAndAddWeed = function(id, weed) {
  debug('findByIdAndAddWeed');

  return List.findById(id)
    .then( list => {
      weed.listID = list._id;
      this.tempList = list;
      return new Weed(weed).save();
    })
    .then( weed => {
      this.tempList.weedz.push(weed._id);
      this.tempWeed = weed;
      return this.tempList.save();
    })
    .then( () => {
      return this.tempWeed;
    })
    .catch( err => Promise.reject(createError(404, err.message)));
};