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

// Return all Product details based on userid
router.get('/purchaselist', function(req, res){
 
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);
 
    // Get the documents collection
    var collection = db.collection('purchased');
 
    // Find all students
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
      //Close connection
      db.close();
    });
  }
  });
});

// Route to the page we can add products from using newpurchase.jade

  router.get('/newpurchase', function(req, res){
    res.render('newpurchase', {title: 'Add purchase' });
});


  router.post('/addpurchase', function(req, res){
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        // Get the documents collection
        var collection = db.collection('purchase');
 
        // Get the student data passed from the form
        var user1 = {user: req.body.user, product: req.body.product,
          category: req.body.category, price: req.body.price};
 
        // Insert the student data into the database
        collection.insert([user1], function (err, result){
          if (err) {
            console.log(err);
          } else {
 
            // Redirect to the updated student list
            res.redirect("purchaselist");
          }
 
          // Close the database
          db.close();
        });
 
      }
    });
 
  });

router.get('/newpurchased', function(req, res){
    res.render('newpurchased', {title: 'Add purchased' });
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
 
        // Get the student data passed from the form
        var user1 = {userid: req.body.userid, productid: req.body.productid,
           timestamp: req.body.timestamp};
 
        // Insert the purchase data into the database
        collection.insert([user1], function (err, result){
          if (err) {
            console.log(err);
          } else {
            
            // Redirect to the updated student list
            res.redirect("purchaselist");
          }
 
          // Close the database
          db.close();
        });
 
      }
    });
 
  });


router.get('/newsearched', function(req, res){
    res.render('newsearched', {title: 'Add Searched' });
});

// Add Search details to DB
router.post('/addsearched', function(req, res){
 
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        // Get the documents collection
        var collection = db.collection('searched');
 
        // Get the student data passed from the form
        var user1 = {userid: req.body.userid, productid: req.body.productid,
           timestamp: req.body.timestamp};
 
        // Insert the purchase data into the database
        collection.insert([user1], function (err, result){
          if (err) {
            console.log(err);
          } else {
 
            // Redirect to the updated student list
            res.send("Searched Details Added");
          }
 
          // Close the database
          db.close();
        });
 
      }
    });
 
  });


// Return previous purchased products based on user id
router.get('/rcmd', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // We are connected
    console.log('Connection established to', url);
 
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


module.exports = router;
