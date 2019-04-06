const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StrikeSchema = new Schema({
  name: String,
  date: Date,
  reason: String
});

mongoose.model("strikes", StrikeSchema);
