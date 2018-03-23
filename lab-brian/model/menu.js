'use strict';

const mongoose = require('mongoose');
const debug = require('debug')('entree:menu');
const createError = require('http-errors');
const Entree = require('./entree.js');


const menuSchema = mongoose.Schema({
  name: {type: String, required: true},
  timestamp: {type: Date, required: true},
  entrees: [{type: mongoose.Schema.Types.ObjectId, ref: 'entree'}],
});

const Menu = module.exports = mongoose.model('menu', menuSchema);

Menu.findByIdAndAddEntree = function(id, entree) {
  debug('findbyidandaddentree');

  return Menu.findById(id)
    .catch( err => Promise.reject(createError(404, err.message)))
    .then( menu => {
      entree.menuID = menu._id;
      this.tempMenu = menu;
      return new Entree(entree).save();
    })
    .then( entree => {
      this.tempMenu.entrees.push(entree._id);
      this.tempEntree = entree;
      return this.tempMenu.save();
    })
    .then( () => {
      return this.tempEntree;
    });
};