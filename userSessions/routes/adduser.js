var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err, result){
	console.log('adduser: cassandra connected');
});


/* GET users listing. */
router.get('/', function(req, res) {
	res.render('adduser');
});

var insertUser = 'INSERT INTO users.user_details(userid, firstname, lastname, username, email, password) VALUES(?,?,?,?,?,?)';

router.post('/', function(req, res){
	id = cassandra.types.uuid();
	client.execute(insertUser,[id, req.body.firstname, req.body.lastname, req.body.username, req.body.email, req.body.password], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		}else{
			console.log('User Added');
			res.redirect('/');
		}
	});
});

module.exports = router;
