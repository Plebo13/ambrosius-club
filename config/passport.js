const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Member = mongoose.model('members');

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function(username, password, done) {
    Member.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (!user.validatePassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  Member.findById(id, function(err, user) {
    cb(err, user);
  });
});
