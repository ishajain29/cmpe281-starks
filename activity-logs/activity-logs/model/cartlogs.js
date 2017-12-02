var mongoose = require('mongoose');

var Product = new mongoose.Schema({
  id: String,
  quantity: Number,
  name: String},
  {_id: false}
);

var cartlogsSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  cartid: {
    type: String
  },
  cartname: {
    type: String,
    required: true
  },
  typeofcart: {
    type: String,
    required: true
  },
  products: {
    type: Product
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
    default: (new Date().getHours())+":"+(new Date().getMinutes())+":"+(new Date().getSeconds())
  },
  date: {
    type: String,
    default: (new Date().getMonth()+1)+"-"+(new Date().getDate())+"-"+(new Date().getFullYear())
  }
},
{collection: 'cartlogs'});

var CartLogs = module.exports = mongoose.model('usercart', cartlogsSchema);
