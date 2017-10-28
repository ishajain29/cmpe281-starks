var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('user: cassandra connected');
});

var getUserByUsername = 'SELECT * FROM users.user_details WHERE username = ? ALLOW FILTERING';

/* GET users listing. */
router.get('/:username', function(req, res) {
	client.execute(getUserByUsername,[req.params.username], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			res.render('user', {
				username: result.rows[0].username,
				firstname: result.rows[0].firstname,
				lastname: result.rows[0].lastname,
				email: result.rows[0].email
			})
		}
	});
});

var deleteUser = "DELETE FROM users.user_details  WHERE username = ? ALLOW FILTERING";
;

router.delete('/:username', function(req, res){
	client.execute(deleteUser,[req.params.username], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else{
			res.json(result);
		}
	});
});

module.exports = router;
