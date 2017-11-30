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
    default: (new Date().getHours())+":"+(new Date().getMinutes())+":"+(new Date().getSeconds())
  },
  date: {
    type: String,
    default: (new Date().getMonth()+1)+"-"+(new Date().getDate())+"-"+(new Date().getFullYear())
  }
},
{collection: 'userlogs'},
{versionKey: false})
;

var UserLogs = module.exports = mongoose.model('userlogs', userlogsSchema);
