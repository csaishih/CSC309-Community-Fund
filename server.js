var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var app = express();

var connection = mysql.createConnection({
	host: 'Shihan',
	user: 'g3aishih',
	password: 'g3aishih!password',
	database: 'communityfund',
	port: 3306
});

connection.connect();


var s = connection.query('SELECT * FROM user', function(err, result, fields){
	if (err) {
		throw err;
	} else {
		console.log('result: ', result);
	}
});

connection.end();


app.get('/', function(req, res) {
	res.sendFile('src/html/root.html', {root: __dirname});
});

app.get('/login.html', function(req, res) {
	res.sendFile('src/html/login.html', {root: __dirname});
});

app.get('/signup.html', function(req, res) {
	res.sendFile('src/html/signup.html', {root: __dirname});
});

app.get('/setup.html', function(req, res) {
	res.sendFile('src/html/setup.html', {root: __dirname});
});

app.get('/lostpw.html', function(req, res) {
	res.sendFile('src/html/lostpw.html', {root: __dirname});
});

app.post('/signup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var repassword = req.body.repassword;
	
});

app.listen(8080);
