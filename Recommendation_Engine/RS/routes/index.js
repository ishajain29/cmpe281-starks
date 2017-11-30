var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

  // Get a Mongo client to work with the Mongo server
  var MongoClient = mongodb.MongoClient;
  // Define where the MongoDB server is
  //var url = 'mongodb://13.57.140.130:27017/sampsite';
  var url = 'mongodb://localhost:27017/sampsite';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Get all Product Purchase details 
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
        console.log('Connected to Server',url);
 
        // Get the documents collection
        var collection = db.collection('purchased');
        var arrProducts = req.body.products;
        console.log(arrProducts)
        var userProducts = [];

        for(var i = 0; i < arrProducts.length; i++){
          // Get the purchased details passed from the form
          var user = {userid: arrProducts[i].userid, productid: arrProducts[i].productid, category: arrProducts[i].category,
             purchasetime: new Date()};

          userProducts.push(user);
        }

        // Insert the purchase data into the database
        collection.insert(userProducts, function (err, result){
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
router.get('/rspurchased/:userid', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    // Get the documents collection
    var collection = db.collection('purchased');
 
    // Find all products
    collection.find({userid: req.params.userid},{"_id":0,"productid":1}).toArray(function (err, result) {
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
        console.log('Connected to Server',url);
 

        // Get the documents collection
        var collection = db.collection('searched');
        var arrProducts = req.body.products;
        var userProducts = [];
        var userid = req.body.userid;

        for(var i = 0; i < arrProducts.length; i++){
          // Get the purchased details passed from the form
          var user = {userid: userid, productid: arrProducts[i].productid,
             purchasetime: new Date()};

          userProducts.push(user);
        }

        // Insert the purchase data into the database
        collection.insert(userProducts, function (err, result){
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






// GET all Searched Product details 
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
router.get('/rssearched/:userid', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    var collection = db.collection('searched');
 
    // FIND PRODUCT ID OF RECENTLY SEARCHED PRODUCT
    collection.find({userid: req.params.userid},{"_id":0,"productid":1}).toArray(function (err, result) {
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
// Get productlist based on user purchased category
router.get('/rscategory/:userid', function(req, res){
  // Connect to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the Server', err);
  } else {
    var collection = db.collection('purchased');
 
    // FIND PRODUCT ID OF RECENTLY SEARCHED PRODUCT
    collection.find({userid: req.params.userid},{"_id":0,"category":1}).toArray(function (err, result) {
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
