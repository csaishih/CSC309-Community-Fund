var bcrypt = require('bcrypt');
var User = require('./server-controller-user');

//Checks that the email exists in the system
function authenticateEmail(email, callback) {
	User.findUser(email, function(response) {
		callback(response != null)
	});
}

//Checks that the email does not already exist in the system
function authenticateSignUp(email, callback) {
	User.findUser(email, function(response) {
		callback(response == null)
	});
}

//
function authenticateLogin(email, password, callback) {
	User.findUser(email, function(response) {
		if (response == null) {
			callback(false);
		} else {
			bcrypt.compare(password, response.login.password, function(error, res) {
				if (error) {
					console.log(error);
					throw error;
				} else {
					callback(res);
				}
			});
		}
	});
}

exports.authenticateEmail = authenticateEmail;
exports.authenticateSignUp = authenticateSignUp;
exports.authenticateLogin = authenticateLogin;