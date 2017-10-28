var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var fs = require('fs');
var mongoose = require('mongoose');
var db = mongoose.connection;
let Search = require('../model/search');

/* Check if db connection is not available */
db.on('error', function(error){
  console.log(error);
});

/* Check if db connection is available */
db.once('open',function(){
  console.log('Connection Established');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Display the user search logs */
router.route('/search')
    .get(function(req, res, next) {

        Search.find({}, function (err, result) {
              if (err) {
                  res.send('There was an error displaying the collection');
              } else if(result.length) {
                  res.send(result);
              }
              else {
                res.send('No documents available');
              }
        });
    })
/* Adding a search request to the database */
    .post(function(req, res, next) {

        var userid = req.body.userid,
        keyword = req.body.keyword,
        timestamp = req.body.timestamp

        Search.create({
          userid : userid,
          keyword : keyword,
          timestamp : timestamp
        }, function(err,result){
          if(err) {
            res.send("There was a problem adding info to DB");
          } else {
            console.log("Creating new search" +result);
            res.json(result);
          }
        })
    });








// router.get('/search', function(req,res,next){
//
//   MongoClient.connect(url,function(err,db){
//     if(err){
//       console.log('Unable to connect',err);
//     }
//     else{
//       console.log("Connection established");
//       var collection=db.collection('searchop');
//
//       collection.find({}).toArray(function(err,result){
//         if(err){
//           res.send(err);
//         }
//         else if(result.length){
//           res.send(result);
//         }
//         else {
//           var err = new Error('No Content');
//           err.status = 204;
//           next(err);
//         }
//
//         db.close();
//       });
//     }
//   })
// });

module.exports = router;
