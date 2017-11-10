var mongoose = require('mongoose');

var searchlogsSchema = new mongoose.Schema({
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
{collection: 'searchlogs'});

var Search = module.exports = mongoose.model('searchlogs', searchlogsSchema);
