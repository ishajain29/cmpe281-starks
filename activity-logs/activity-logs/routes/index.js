var express = require('express');
var router = express.Router();
var mongodb=require('mongodb');
var mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/activitylogs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/logs', function(req,res){
var MongoClient=mongodb.MongoClient;
var url='mongodb://localhost:27017/activitylogs';

  MongoClient.connect(url,function(err,db){
    if(err){
      console.log('Unable to connect',err);
    }
    else{
      console.log("Connection established");
      var collection=db.collection('activity');

      collection.find({}).toArray(function(err,result){
        if(err){
          res.send(err);
        }
        else if(result.length){
          res.send(result);
        }
        else {
          res.send('No documents found');
        }

        db.close();
      });
    }
  })
});

module.exports = router;
