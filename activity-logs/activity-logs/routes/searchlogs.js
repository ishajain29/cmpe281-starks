var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let SearchLogs = require('../model/searchlogs');

/* Display the user search logs */
router.route('/')
    .get(function(req, res, next) {

        SearchLogs.find({}, function (err, result) {
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

        SearchLogs.create({
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


module.exports = router;
