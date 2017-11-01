var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('user: cassandra connected');
});

var getUserById = 'SELECT * FROM users.user_details WHERE userid = ?';

/* GET users listing. */
router.get('/:userid', function(req, res) {
	client.execute(getUserById,[req.params.userid], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			res.render('user', {
				username: result.rows[0].username,
				firstname: result.rows[0].firstname,
				lastname: result.rows[0].lastname,
				email: result.rows[0].email,
				userid: result.rows[0].userid
			})
		}
	});
});


module.exports = router;
