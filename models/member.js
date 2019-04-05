const mongoose = require('mongoose');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const Member = new Schema({
  member_id: Number,
  name: String,
  username: String,
  password_hash: String,
  salt: String,
});

Member.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password_hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

Member.methods.validatePassword = function(password) {
  const password_hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.password_hash === password_hash;
};

mongoose.model('members', Member);
