// models/fruit.js

const mongoose = require('mongoose');

const stadiumSchema = new mongoose.Schema({
  name: { type: String, required: true},
  team: { type: String, required: true},
  location: { type: String, required: true},
  yearBuilt: { type: Number, required: true},
  cost: Number,
  seats: Number,
  isIndoor: Boolean,
});

module.exports = mongoose.model("Stadium", stadiumSchema); // create model
