const PORT = 8080;

// Imports
const express = require('express');
const session = require("express-session");
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Setup
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  secret: 'ambr0siu$Club'
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/ambrosius');
const Schema = mongoose.Schema;
const UserDetail = new Schema({
  member_id: Number,
  name: String,
  password: String
});
const UserDetails = mongoose.model('members', UserDetail, 'members');

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  UserDetails.findById(id, function(err, user) {
    cb(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'member',
    passwordField: 'password'
  },
  function(username, password, done) {
    UserDetails.findOne({
      name: username
    }, function(err, user) {
      if (err) {
        console.log(err);
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

// Routes
app.get('/', function(req, res) {
  if (req.user) {
    res.redirect('/strikes');
  } else {
    res.redirect('/login');
  }
});

app.get('/strikes', function(req, res) {
  res.render('strikes', {
    user: req.user.name
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.render('strikes', {
      user: req.user.name
    });
  });

app.listen(PORT);
console.log('Server listen at port ' + PORT);
