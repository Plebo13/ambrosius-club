var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/ambrosius-strikes";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("ambrosius-strikes");
  dbo.collection("members").find({}, { projection: { _id: 0, name: 1 } }).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});
