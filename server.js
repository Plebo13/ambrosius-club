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
require('./models/member');
require("./models/strike");
const Member = mongoose.model('members');
const Strike = mongoose.model('strikes');

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  Member.findById(id, function(err, user) {
    cb(err, user);
  });
});

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

// Routes
app.use('/', function(req, res, next) {
  if (req.user || req.originalUrl == "/login") {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/', function(req, res) {
  res.redirect('/strikes');
});

app.get('/calendar', function(req, res) {
  res.render('calendar', {
    user: req.user.name
  });
});

app.get('/strikes', function(req, res) {
  Strike.find({}, function(err, strikes) {
    if (strikes) {
      res.render('strikes', {
        user: req.user.name,
        strikes: strikes
      });
    } else {
      res.render('strikes', {
        user: req.user.name,
        strikes: []
      });
    }
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
    res.redirect('/strikes');
  });

app.listen(PORT);
console.log('Server listen at port ' + PORT);
