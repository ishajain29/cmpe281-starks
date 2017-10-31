var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let UserCart = require('../model/usercart');

/* Display the user cart logs */
router.route('/')
    .get(function(req, res, next) {

        UserCart.find({}, function (err, result) {
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
/* Adding a user cart log to the database */
    .post(function(req, res, next) {

        var userid = req.body.userid,
        cartid = req.body.cartid,
        timestamp = req.body.timestamp;

        UserCart.create({
          userid : userid,
          cartid : cartid,
          timestamp : timestamp
        }, function(err,result){
          if(err) {
            res.send("There was a problem adding info to DB");
          } else {
            console.log("Creating new user cart log" +result);
            res.json(result);
          }
        })
    });


module.exports = router;
