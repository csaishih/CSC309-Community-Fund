var mysql = require('mysql');
var bcrypt = require('bcrypt');

var connection = mysql.createConnection({
	host: 'communityfund.c76klgz6nmgp.us-east-1.rds.amazonaws.com',
	user: 'g3aishih',
	password: 'g3aishih!password',
	database: 'communityfund',
	port: 3306
});

function checkPassword(password, repassword) {
	if (password.length > 4) {
		return password == repassword;
	}
	return false;
}

function authenticateEmail(email, callback) {
	connection.query("SELECT email FROM user WHERE email = '" + email + "'", function(err, result) {
		if (err) {
			throw err;
		} else {
			callback(result.length > 0);
		}
	});
}

function authenticateSignUp(email, password, repassword, callback) {
	authenticateEmail(email, function(success) {
		if (success) {
			callback(false);
		} else {
			callback(checkPassword(password, repassword));
		}
	});
}

function authenticateLogin(email, password, callback) {
	connection.query("SELECT password FROM user WHERE email ='" + email + "'", 
		function(err, result) {
			if (err) {
				throw err;
			} else {
				bcrypt.compare(password, result[0]['password'], function(err, res) {
					if (err) {
						throw err;
					} else {
						callback(res);
					}
				});
			}
		});
}

function generate_password(n, a) {
  var index = (Math.random() * (a.length - 1)).toFixed(0);
  return n > 0 ? a[index] + generate_password(n - 1, a) : '';
}

function changePassword(email, password, callback) {
	authenticateEmail(email, function(success) {
		if (success) {
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
					connection.query("UPDATE user SET password = '" + hash + "' WHERE email = '" + email + "'", function(err, result) {
						if (err) {
							throw err;
						} else {
							console.log(result);
							if (result) {
								callback(true);
							}
						}
					});
				});
			});
		} else {
			callback(false);
		}
	});
}

function createUser(name, email, password) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(password, salt, function(err, hash) {
			connection.query("INSERT INTO user(email, name, password) VALUES ('" + email + "','" + name + "','" + hash + "')",
				function(err, result) {
					if (err) {
						throw err;
					} else {
						console.log("Created user successfully");
					}
				});
		});
	});
}

exports.checkPassword = checkPassword;
exports.authenticateEmail = authenticateEmail;
exports.authenticateSignUp = authenticateSignUp;
exports.authenticateLogin = authenticateLogin;
exports.generate_password = generate_password;
exports.changePassword = changePassword;
exports.createUser = createUser;