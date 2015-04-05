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

function createProject(title, description, category, tags, email, callback) {
	User.findUser(email, function(response) {
		new Project({
			author: {
				'id': response._id,
				'name': response.name,
				'email': response.login.email
			},
			title: title,
			normalized: title.toLowerCase(),
			description: description,
			tags: tags,
			category: category
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


function categoryCount(callback) {
	var category_count = {
		health: 0,
		technology: 0,
		education: 0,
		finance: 0,
		travel: 0
	}
	Project.find({
		'category': "Health"
	}, function(error, response) {
		if (error) {
			console.log(error);
			throw error;
		} else {
			category_count.health = response.length;
			Project.find({
				'category': "Technology"
			}, function(error, response) {
				if (error) {
					console.log(error);
					throw error;
				} else {
					category_count.technology = response.length;
					Project.find({
						'category': "Education"
					}, function(error, response) {
						if (error) {
							console.log(error);
							throw error;
						} else {
							category_count.education = response.length;
							Project.find({
								'category': "Finance"
							}, function(error, response) {
								if (error) {
									console.log(error);
									throw error;
								} else {
									category_count.finance = response.length;
									Project.find({
										'category': "Travel"
									}, function(error, response) {
										if (error) {
											console.log(error);
											throw error;
										} else {
											category_count.travel = response.length;
											callback(category_count);
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
}


exports.findProject = findProject;
exports.findProjects = findProjects;
exports.findOtherProjects = findOtherProjects;
exports.deleteProject = deleteProject;
exports.createProject = createProject;
exports.updateIdea = updateIdea;
exports.categoryCount = categoryCount;