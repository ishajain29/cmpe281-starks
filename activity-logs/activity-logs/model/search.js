var mongoose = require('mongoose');

var searchSchema = new mongoose.Schema({
  userid: {
    type: String,
    required:true
  },
  keyword: {
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
{collection: 'searchdata'});

let Search = module.exports = mongoose.model('search', searchSchema);
