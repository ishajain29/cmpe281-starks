var mongoose = require('mongoose');  
var bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({  
  firstname: String,
  lastname: String,
  email: String,
  password: String
});

UserSchema.pre('save', function (next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function (err, hash) {
			if(err) return next(err);

			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if(err) return callback(err);
		callback(undefined, isMatch);
	});
};

mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');