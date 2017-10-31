var mongoose = require('mongoose');

var usercartSchema = new mongoose.Schema({
  userid: {
    type: String,
    required:true
  },
  cartid: {
    type: String,
    required:true
  },
  timestamp: {
    type: String,
    //default:Date.now,
    required:true
  } //{ type: Date, default: Date.now },
  //isloved: Boolean
},
{collection: 'usercartdata'});

let UserCart = module.exports = mongoose.model('usercart', usercartSchema);
