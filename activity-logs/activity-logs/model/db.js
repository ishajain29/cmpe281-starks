var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://10.0.2.141:27017,10.0.0.18:27017,10.0.0.87:27017,10.0.2.183:27017,10.0.2.219:27017/activitylogs', {
  "db": {
"readPreference": "secondaryPreferred"
},
"replset": {
"rs_name": "rs0"
}
});
