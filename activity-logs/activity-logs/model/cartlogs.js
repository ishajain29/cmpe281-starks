var mongoose = require('mongoose');

var Product = new mongoose.Schema({
  id: String,
  quantity: Number},
  {_id: false}
);

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
    type: [Product]
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

var CartLogs = module.exports = mongoose.model('usercart', cartlogsSchema);
