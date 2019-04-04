const PORT = 8080;

var express = require('express');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var url = "mongodb://localhost:27017/ambrosius";

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(PORT);
console.log('Server listen at port ' + PORT);
