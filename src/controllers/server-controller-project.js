var Project = require('../models/project');
var User = require('./server-controller-user');

//Finds a project in the system
function findProject(id, callback) {
	Project.findOne({
		'_id': id
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			callback(response);
		}
	});
}

//Find all projects initiated by a certain user
function findProjects(author_id, callback) {
	Project.find({
		'author.id': author_id
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			callback(response);
		}
	});
}

function findOtherProjects(id, callback) {
	Project.find({
		'author.id': {$ne: id}
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			callback(response);
		}
	});
}

function deleteProject(id, callback) {
	Project.remove({
		'_id': id
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			callback(response);
		}
	});
}

function parseInterests(user_interests) {
	var interests = []
	if (user_interests.art) {interests.push('Art')}
	if (user_interests.design) {interests.push('Design')}
	if (user_interests.fashion) {interests.push('Fashion')}
	if (user_interests.film) {interests.push('Film')}
	if (user_interests.food) {interests.push('Food')}
	if (user_interests.games) {interests.push('Games')}
	if (user_interests.music) {interests.push('Music')}
	if (user_interests.photography) {interests.push('Photography')}
	if (user_interests.technology) {interests.push('Technology')}
	return interests;
}

function parseLocations(user_locations) {
	var location = []
	if (user_locations.paloalto) {location.push('Palo Alto')}
	if (user_locations.sanjose) {location.push('San Jose')}
	if (user_locations.toronto) {location.push('Toronto')}
	if (user_locations.vancouver) {location.push('Vancouver')}
	return location;
}

function createProject(email, title, description, fundgoal, user_interests, user_locations, callback) {
	var interests = parseInterests(user_interests);
	var location = parseLocations(user_locations);
	fundgoal = parseInt(fundgoal);

	User.findUser(email, function(response) {
		new Project({
			author: {
				'id': response._id,
				'name': response.name,
				'email': response.login.email
			},
			title: title,
			description: description,
			funds: {
				'goal': fundgoal
			},
			date: {
				'parsedDate': Server.parseDate()
			},
			category: interests,
			location: location
		}).save(function(error, response) {
			if (error) {
				console.log(error);
				throw error;
			} else {
				callback(response);
			}
		});
	});
}

function updateIdea(id, title, description, category, tags, likes, dislikes, callback) {
	Project.findOneAndUpdate({
		'_id': id
	},
	{
		$set: {
			'title': title,
			'description': description,
			'category': category,
			'tags': tags
		},
		$inc: {
			'rating.likes': likes,
			'rating.dislikes': dislikes
		}
	},
	{
		new: true
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			callback(response);
		}
	});
}

exports.findProject = findProject;
exports.findProjects = findProjects;
exports.findOtherProjects = findOtherProjects;
exports.deleteProject = deleteProject;
exports.createProject = createProject;
exports.updateIdea = updateIdea;
exports.parseInterests = parseInterests;
exports.parseLocations = parseLocations;