var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
let CartLogs = require('../model/cartlogs');

/* Display the user cart logs */
router.route('/')
    .get(function(req, res, next) {

        CartLogs.find({}, function (err, result) {
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
        cartname = req.body.cartname| '',
        typeofcart = req.body.typeofcart| '',
        groupusers = req.body.groupusers,
        activity =  req.body.typeofcart| '',
        timestamp = req.body.timestamp;

        console.log(userid+" "+cartid+" "+" "+cartname+" "+typeofcart+" "+groupusers+" "+activity+" "+timestamp);

        CartLogs.create({
          userid : userid,
          cartid : cartid,
          cartname : cartname,
          typeofcart : typeofcart,
          groupusers : groupusers,
          activity : activity,
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
