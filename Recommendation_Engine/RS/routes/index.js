var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;
  // Define where the MongoDB server is
  var url = 'mongodb://localhost:27017/sampsite';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get all Product details based on userid
router.get('/purchaselist', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    console.log('Connection established to', url);
    // Get the documents collection
    var collection = db.collection('purchased');
 
    // Find all products
    collection.find({}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        console.log(result)
        res.send(result)
        // Call product catalog web service to fetch details of product and display in Mainpage.
      } else {
        res.send('No documents found');
      }
      db.close();
    });
  }
  });
});

// Add purchase details to DB (Userid, Productid, Category)
router.post('/addpurchased', function(req, res){
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        // Get the documents collection
        var collection = db.collection('purchased');
 
        // Get the purchased details passed from the form
        var user1 = {userid: req.body.userid, productid: req.body.productid, category: req.body.category,
           purchasetime: new Date()};
 
        // Insert the purchase data into the database
        collection.insert([user1], function (err, result){
          if (err) {
            console.log(err);
          } else {
            res.send("Purchase Details Added")
          }
          // Close the database
          db.close();
        });

      }
    });
  });

// RECOMMENDATIONS
// Return previous purchased products based on user id
router.get('/rspurchased', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // Get the documents collection
    var collection = db.collection('purchased');
 
    // Find all students
    collection.find({userid: req.query.userid},{"_id":0,"productid":1}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        console.log(result)
        res.send(result)
        // Call product catalog web service to fetch details of product and display in Mainpage.
      } else {
        res.send('No documents found');
      }
      //Close connection
      db.close();
    });
  }
  });
});

// Add Search details to DB
router.post('/addsearched', function(req, res){
 
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else { 
        var collection = db.collection('searched');
 
        // Get the searched product data passed from the form
        var user1 = {userid: req.body.userid, productid: req.body.productid,
           searchtime: new Date()};
 
        // Insert the search details into the database
        collection.insert([user1], function (err, result){
          if (err) {
            console.log(err);
          } else {  
            res.send("Searched Details Added");
          }
          db.close();
        });
 
      }
    });
  });


// GET all Searched Product details based on userid
router.get('/searchlist', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    var collection = db.collection('searched');
 
    // Find all searched products
    collection.find({}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        console.log(result)
        res.send(result)
        // Call product catalog web service to fetch details of product and display in Mainpage.
      } else {
        res.send('No documents found');
      }
      db.close();
    });
  }
  });
});

// Recommendations
// Get searched products details based on user id
router.get('/rcmds', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    var collection = db.collection('searched');
 
    // FIND PRODUCT ID OF RECENTLY SEARCHED PRODUCT
    collection.find({userid: req.query.userid},{"_id":0,"productid":1}).toArray(function (err, result) {
      if (err) {
        res.send(err);
      } else if (result.length) {
        console.log(result)
        res.send(result)
        // Call product catalog web service to fetch details of product and display in Mainpage.
      } else {
        res.send('No documents found');
      }
      db.close();
    });
  }
  });
});


module.exports = router;
