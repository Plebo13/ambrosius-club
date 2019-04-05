const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Strike = new Schema({
  name: String,
  date: Date,
  reason: String
});

mongoose.model('strikes', Strike);
