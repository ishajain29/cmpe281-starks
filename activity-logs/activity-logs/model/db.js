var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/activitylogs?w=2&wtimeoutMS=2000');
