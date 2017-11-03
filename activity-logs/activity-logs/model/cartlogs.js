var mongoose = require('mongoose');

var cartlogsSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  cartid: {
    type: String,
    required: true
  },
  cartname: {
    type: String
  },
  typeofcart: {
    type: String,
    required: true
  },
  products: {
    productid: {
      type: String
    },
    qty: {
      type: Number
    }
  },
  groupusers: {
    type: [String]
  },
  activity: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    //default:Date.now,
    required:true
  } //{ type: Date, default: Date.now },
  //isloved: Boolean
},
{collection: 'cartlogs'});

let CartLogs = module.exports = mongoose.model('usercart', cartlogsSchema);
