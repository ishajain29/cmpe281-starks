var express = require('express');
var app = express();
var db = require('./db');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');
var cors = require('cors');

var morgan = require('morgan');

var UserController = require('./user/UserController');

app.set('view engine','html');
app.set('views',__dirname + '/views');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret:"zxcvbnmzxcvbnm", resave:false, saveUninitialized:true}));
app.use(express.static(__dirname + '/public'));
app.use(cors())

app.use('/user', UserController);

app.get('/register',function(req, res) {
	res.sendFile(path.join(__dirname,'views/registered.html'));
});

app.get('/dashboard', function(req, res) {
    if(!req.session.user){
        return res.status(404).send();
    }
    return res.status(200).sendFile(path.join(__dirname,'views/dashboard.html'));
});



module.exports = app;