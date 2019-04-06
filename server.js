const PORT = 8080;


// Imports
const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const helmet = require("helmet");


// Setup
var app = express();
var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(session({
  name: "session",
  secret: "ambr0siu$Club",
  cookie: {
    httpOnly: true,
    expires: expiryDate
  }
}));
app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/ambrosius");
require("./models/member");
require("./models/strike");
const Strike = mongoose.model("strikes");

require("./config/passport");


// Routes
app.use("/", function(req, res, next) {
  if (req.user || req.originalUrl === "/login") {
    next();
  } else {
    res.redirect("/login");
  }
});

app.get("/", function(req, res) {
  res.redirect("/strikes");
});

app.get("/calendar", function(req, res) {
  res.render("calendar", {
    user: req.user
  });
});

app.get("/strikes", function(req, res) {
  Strike.find({}, function(err, strikes) {
    if (strikes) {
      res.render("strikes", {
        user: req.user,
        strikes: strikes
      });
    } else {
      res.render("strikes", {
        user: req.user,
        strikes: []
      });
    }
  });
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.redirect("/strikes");
  });

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/login");
});


// Exe
app.listen(PORT);
console.log("Server listen at port " + PORT);
