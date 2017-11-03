var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;


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
