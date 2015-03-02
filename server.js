var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var user = require('./src/js/user');
var app = express();

//For parsing body
app.use(bodyParser.urlencoded({ extended: false}));

//Root page
app.get('/', function(req, res) {
	res.sendFile('src/html/root.html', {root: __dirname});
});

//Login page
app.get('/login.html', function(req, res) {
	res.sendFile('src/html/login.html', {root: __dirname});
});

//Sign up page
app.get('/signup.html', function(req, res) {
	res.sendFile('src/html/signup.html', {root: __dirname});
});

//Set up page
app.get('/setup.html', function(req, res) {
	res.sendFile('src/html/setup.html', {root: __dirname});
});

//Lost password page
app.get('/lostpw.html', function(req, res) {
	res.sendFile('src/html/lostpw.html', {root: __dirname});
});

app.post('/signup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//Authenticate signup
	user.authenticateSignUp(email, password, repassword, function(success) {
		if (success) {
			user.createUser(name, email, password);
			res.sendFile('src/html/login.html', {root: __dirname});
		} else {
			//Authentication failed
			console.log("Authentication failed");
			res.sendFile('src/html/signup.html', {root: __dirname});
		}
	});
});

app.listen(8080);
