var mongoose = require('mongoose');

var userlogsSchema = new mongoose.Schema({
  userid: {
    type: String,
    required:true
  },
  activity: {
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
{collection: 'userlogs'},
{versionKey: false})
;

var UserLogs = module.exports = mongoose.model('userlogs', userlogsSchema);
