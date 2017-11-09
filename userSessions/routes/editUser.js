var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('edituser: cassandra connected');
});

var getUserById = 'SELECT * FROM users.user_details WHERE userid = ?';

/* GET users listing. */
router.get('/:userid', function(req, res) {
	client.execute(getUserById,[req.params.userid], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			res.render('editUser', {
				userid: result.rows[0].userid,
				username: result.rows[0].username,
				firstname: result.rows[0].firstname,
				lastname: result.rows[0].lastname,
				email: result.rows[0].email,
				password: result.rows[0].password,
				
			})
		}
	});
});

var upsertUser = 'INSERT INTO users.user_details(userid, firstname, lastname, username, email, password) VALUES(?,?,?,?,?,?)';

router.post('/', function(req, res){
	
	client.execute(upsertUser,[req.body.id, req.body.firstname, req.body.lastname, req.body.username, req.body.email, req.body.password], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			console.log('User Added');
			res.redirect('/');
		}
	});
});

module.exports = router;
