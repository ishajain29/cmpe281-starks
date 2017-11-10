var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var UserLogs = require('../model/userlogs');

/* Display the user accounts logs */
router.route('/')
    .get(function(req, res, next) {

        UserLogs.find({}, function (err, result) {
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
/* Adding a user accounts log to the database */
    .post(function(req, res, next) {

        var userid = req.body.userid,
        activity = req.body.activity,
        timestamp = req.body.timestamp;

        UserLogs.create({
          userid : userid,
          activity : activity,
          timestamp : timestamp
        }, function(err,result){
          if(err) {
            res.send("There was a problem adding info to DB");
          } else {
            console.log("Creating new userlogs" +result);
            res.json(result);
          }
        })
    });


module.exports = router;
