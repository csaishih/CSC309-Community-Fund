var bcrypt = require('bcrypt');
var User = require('../models/user');

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

function getUserProjects(email, callback) {
	findUser(email, function(response) {
		findProjectAuthor(response._id, function(response) {
			callback(response);
		});
	});
}

function getOtherProjects(email, callback) {
	User.findOne({
		'login.email': email
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			if (response.filter.length > 0) {
				if (response.sortingPreference.sortBy == 'date') {
					Project.find({
						'author.id': {$ne: response._id},
						'category': {$in: response.categoryPreference},
						'tags': {$in: response.filter}
					}, null, {
						sort: {
							'date': response.sortingPreference.order
						}
					}, function(error, response) {
						if (error) {
							console.log(error);
							throw error;
						} else {
							console.log(response);
							callback(response);
						}
					});
				} else if (response.sortingPreference.sortBy == 'normalized') {
					Project.find({
						'author.id': {$ne: response._id},
						'category': {$in: response.categoryPreference},
						'tags': {$in: response.filter}
					}, null, {
						sort: {
							'normalized': response.sortingPreference.order
						}
					}, function(error, response) {
						if (error) {
							console.log(error);
							throw error;
						} else {
							callback(response);
						}
					});
				}
			} else {
				if (response.sortingPreference.sortBy == 'date') {
					Project.find({
						'author.id': {$ne: response._id},
						'category': {$in: response.categoryPreference}
					}, null, {
						sort: {
							'date': response.sortingPreference.order
						}
					}, function(error, response) {
						if (error) {
							console.log(error);
							throw error;
						} else {
							callback(response);
						}
					});
				} else if (response.sortingPreference.sortBy == 'normalized') {
					Project.find({
						'author.id': {$ne: response._id},
						'category': {$in: response.categoryPreference}
					}, null, {
						sort: {
							'normalized': response.sortingPreference.order
						}
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
		}
	});
}

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


function findRating(email, id, callback) {
	User.findOne({
		'login.email': email,
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else if (response) {
			if ((response.rating.likes).indexOf(id) > -1) {
				callback(1);
			} else if ((response.rating.dislikes).indexOf(id) > -1) {
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


function pushUserRating(email, flag, id, callback) {
	if (flag == 1) {
		User.findOneAndUpdate({
			'login.email': email
		},
		{
			$push: {
				'rating.likes': id
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
				'rating.dislikes': id
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

function pullUserRating(email, flag, id, callback) {
	if (flag == 1) {
		User.findOneAndUpdate({
			'login.email': email
		},
		{
			$pull: {
				'rating.likes': id
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
				'rating.dislikes': id
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

exports.findUser = findUser;
exports.createUser = createUser;
exports.getUserProjects = getUserProjects;
exports.getOtherProjects = getOtherProjects;
exports.getRatings = getRatings;
exports.findRating = findRating;
exports.pushUserRating = pushUserRating;
exports.pullUserRating = pullUserRating;