//Server

//Add dependencies 
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var User = require('./src/models/user');
var Project = require('./src/models/project');
var server = require('./src/controllers/server-controller')
var app = express();

//Connect to Mongo database
mongoose.connect('mongodb://localhost/test');

//Setup routes
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use('/api', require('./src/routes/api'));
app.use('/src', express.static(__dirname + '/src'));

//Respond to GET, PUT, POST, DELETE requests
app.get('/', function(req, res) {
	server.authenticateEmail(req.cookies.email, function(response) {
		if (response) {
			res.sendFile('src/html/main.html', {root: __dirname});
		} else {
			res.sendFile('src/html/root.html', {root: __dirname});
		}
	});
});

//Requests by root
app.get('/root.html', function(req, res) {
	res.sendFile('src/html/root.html', {root: __dirname});
});

app.get('/main.html', function(req, res) {
	server.authenticateEmail(req.cookies.email, function(response) {
		if (response) {
			res.sendFile('src/html/main.html', {root: __dirname});
		} else {
			res.redirect('/');
		}
	});
});

app.post('/signup', function(req, res) {
	server.authenticateSignUp(req.body.email, function(response) {
		if (response) {
			server.createUser(req.body.name, req.body.email, req.body.password, function(response) {
				res.send(true);
			});
		} else {
			res.send(false);
		}
	});
});

app.post('/login', function(req, res) {
	server.authenticateLogin(req.body.email, req.body.password, function(response) {
		if (response) {
			res.cookie("email", req.body.email, {
				path: '/',
				httpOnly: true,
				maxAge: 604800000
			});
			res.send(true);
		} else {
			res.send(false);
		}
	});
});

app.post('/logout', function(req, res) {
	res.clearCookie("email");
	res.redirect('/root.html');
});

//User and profile requests
app.get('/getUser', function(req, res) {
	server.findUser(req.cookies.email, function(response) {
		res.json(response);
	});
});

app.get('/getUserProjects', function(req, res) {
	server.getUserProjects(req.cookies.email, function(response) {
		res.json(response);
	});
});

app.get('/getOtherProjects', function(req, res) {
	server.getOtherProjects(req.cookies.email, function(response) {
		res.json(response);
	});
});

app.post('/setupProfile', function(req, res) {
	server.setupProfile(req.cookies.email, req.body.interests, req.body.location, function(response) {
		res.json(response);
	});
});

//Project requests
app.post('/createProject', function(req, res) {

	server.createProject(req.cookies.email, req.body.title, req.body.description, req.body.fundgoal, req.body.category, req.body.location, function(response) {
		res.json(response);
	});
});

app.post('/editProject', function(req, res) {
	server.editProject(req.body.id, req.body.title, req.body.description, req.body.fundgoal, req.body.category, req.body.location, function(response) {
		res.json(response);
	});
});

app.delete('/project/:id', function(req, res) {
	server.deleteProject(req.params.id, function(response) {
		res.json(response);
	});
});

app.get('/view/:id', function(req, res) {
	res.sendFile('src/html/view.html', {root: __dirname});
});

app.get('/findProject/:id', function(req, res) {
	server.findProject(req.params.id, function(response) {
		res.json(response);
	});
});

app.get('/findRating/:id', function(req, res) {
	server.findRating(req.cookies.email, req.params.id, function(response) {
		res.json(response);
	});
});

app.put('/user/:flag', function(req, res) {
	if (req.body.flag == -1) {
		server.pullUserRating(req.cookies.email, req.params.flag, req.body.id, function(response) {
			res.json(response);
		});
	} else if (req.body.flag == 1){
		server.pushUserRating(req.cookies.email, req.params.flag, req.body.id, function(response) {
			res.json(response);
		});	
	} else if (req.body.flag == 0) {
		server.pushUserRating(req.cookies.email, req.params.flag, req.body.id, function(response) {
			server.pullUserRating(req.cookies.email, (1 - req.params.flag), req.body.id, function(response) {
				res.json(response);
			});
		});			
	}
});

app.put('/project/:id', function(req, res) {;
	server.editProjectRep(req.params.id, req.body.likes, req.body.dislikes, function(response) {
		res.json(response);
	});
});
/*
app.post('/createIdea', function(req, res) {
	server.createIdea(req.body.title, req.body.description, req.body.category, req.body.tags, req.cookies.email, function(response) {
		res.json(response);
	});
});




app.get('/getUser', function(req, res) {
	server.getUser(req.cookies.email, function(response) {
		res.send(response);
	});
});





app.get('/getRatings', function(req, res) {
	server.getRatings(req.cookies.email, function(response) {
		res.json(response);
	});
});
*/

//Listen on port 8080
console.log("App is running on localhost:8080");
app.listen(8080);