var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var CartLogs = require('../model/cartlogs');

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
        cartname = req.body.cartname,
        typeofcart = req.body.typeofcart,
        products = req.body.products,
        groupusers = req.body.groupusers,
        activity =  req.body.activity,
        timestamp = req.body.timestamp;

         if(typeof cartname!="undefined")
           typeofcart="Shared";
         else
          typeofcart="User";
    //      console.log(products);
        console.log(userid+" "+cartid+" "+" "+cartname+" "+typeofcart+" "+groupusers+" "+activity+" "+timestamp+" "+products);

        CartLogs.create({
          userid : userid,
          cartid : cartid,
          cartname : cartname,
          typeofcart : typeofcart,
          products : products,
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
