var bcrypt = require('bcrypt');
var User = require('../models/user');
var Project = require('./server-controller-project');
var Server = require('./server-controller');

//Finds a user in the system
function findUser(email, callback) {
	User.findOne({
		'login.email': email
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			callback(response)
		}
	});
}

//Hash the password and create the user
function createUser(name, email, password, callback) {
	bcrypt.genSalt(10, function(error, salt) {
		bcrypt.hash(password, salt, function(error, hash) {
			if (error) {
				console.log(error);
				return error;
			} else {
				new User({
					name: name,
					login: {
						'email': email,
						'password': hash
					},
					date: {
						'parsedDate': Server.parseDate()
					}
				}).save(function(error, response) {
					if (error) {
						console.log(error);
						throw error;
					} else {
						callback(response);
					}
				});
			}
		});
	});
}

//Get all the projects from this user
function getUserProjects(email, callback) {
	findUser(email, function(response) {
		Project.findProjects(response._id, function(response) {
			callback(response);
		});
	});
}

//Get all the projects from other users in this user's community
function getOtherProjects(email, callback) {
	findUser(email, function(response) {
		Project.findOtherProjects(response._id, response.preferences.interests, response.preferences.location, function(response) {
			callback(response);
		});
	});
}

//Get the array of items that this user has rated
function getRatings(email, callback) {
	User.findOne({
		'login.email': email,
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			callback(response.rating);
		}
	});
}

//Check what rating this user has given a certain project or other user
// (1) - Liked
// (-1) - Disliked
// (0) - No rating yet
function findRating(email, id, callback) {
	User.findOne({
		'login.email': email,
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else if (response) {
			if ((response.rated.likes).indexOf(id) > -1) {
				callback(1);
			} else if ((response.rated.dislikes).indexOf(id) > -1) {
				callback(-1);
			} else {
				callback(0);
			}
		} else {
			console.log("FATAL ERROR");
			callback(404);
		}
	});
}

//User has rated something
function pushUserRating(email, flag, id, callback) {
	if (flag == 1) {
		User.findOneAndUpdate({
			'login.email': email
		},
		{
			$push: {
				'rated.likes': id
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
	} else if (flag == 0) {
		User.findOneAndUpdate({
			'login.email': email
		},
		{
			$push: {
				'rated.dislikes': id
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
}

//User has unrated something
function pullUserRating(email, flag, id, callback) {
	if (flag == 1) {
		User.findOneAndUpdate({
			'login.email': email
		},
		{
			$pull: {
				'rated.likes': id
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
	} else if (flag == 0) {
		User.findOneAndUpdate({
			'login.email': email
		},
		{
			$pull: {
				'rated.dislikes': id
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
}

//Set up the user's location and interests
function setupProfile(email, user_interests, user_locations, callback) {
	var interests = Project.parseInterests(user_interests);
	var location = Project.parseLocations(user_locations);
	User.findOneAndUpdate({
		'login.email': email
	},
	{
		$set: {
			'preferences.interests': interests,
			'preferences.location': location
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


exports.findUser = findUser;
exports.createUser = createUser;
exports.getUserProjects = getUserProjects;
exports.getOtherProjects = getOtherProjects;
exports.getRatings = getRatings;
exports.findRating = findRating;
exports.pushUserRating = pushUserRating;
exports.pullUserRating = pullUserRating;
exports.setupProfile = setupProfile;