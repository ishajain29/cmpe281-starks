var express = require('express');
var app = express();
var db = require('./db');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var path = require('path');

var morgan = require('morgan');

var UserController = require('./user/UserController');

app.set('view engine','ejs');
app.set('views',__dirname + '/views');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret:"zxcvbnmzxcvbnm", resave:false, saveUninitialized:true}));

app.use('/userSession/users', UserController);

app.get('/',function(req, res) {
	res.sendFile(path.join(__dirname,'views/index.html'));
});

module.exports = app;