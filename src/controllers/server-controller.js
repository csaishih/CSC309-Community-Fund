//Functions used by the server
var User = require('./server-controller-user');
var Project = require('./server-controller-project');
var Auth = require('./server-controller-authentication');

function parseDate () {
	var date = new Date();
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var parsedDate = months[month] + ' ' + day + ', ' + year;
	return parsedDate
}

exports.findUser = User.findUser;
exports.createUser = User.createUser;
exports.getUserProjects = User.getUserProjects;
exports.getOtherProjects = User.getOtherProjects;
exports.getRatings = User.getRatings;
exports.findRating = User.findRating;
exports.pushUserRating = User.pushUserRating;
exports.pullUserRating = User.pullUserRating;

exports.findProject = Project.findProject;
exports.findProjects = Project.findProjects;
exports.deleteProject = Project.deleteProject;
exports.createProject = Project.createProject;
exports.updateIdea = Project.updateIdea;
exports.categoryCount = Project.categoryCount;

exports.authenticateEmail = Auth.authenticateEmail;
exports.authenticateSignUp = Auth.authenticateSignUp;
exports.authenticateLogin = Auth.authenticateLogin;

exports.parseDate = parseDate;