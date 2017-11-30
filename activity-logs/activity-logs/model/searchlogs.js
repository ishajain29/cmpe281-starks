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
    default: (new Date().getHours())+":"+(new Date().getMinutes())+":"+(new Date().getSeconds())
  },
  date: {
    type: String,
    default: (new Date().getMonth()+1)+"-"+(new Date().getDate())+"-"+(new Date().getFullYear())
  }
},
{collection: 'searchlogs'});

var Search = module.exports = mongoose.model('searchlogs', searchlogsSchema);
