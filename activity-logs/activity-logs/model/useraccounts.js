var mongoose = require('mongoose');

var useraccountsSchema = new mongoose.Schema({
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
{collection: 'useraccountsdata'});

let UserAccounts = module.exports = mongoose.model('useraccounts', useraccountsSchema);
