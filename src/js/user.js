var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'communityfund.c76klgz6nmgp.us-east-1.rds.amazonaws.com',
	user: 'g3aishih',
	password: 'g3aishih!password',
	database: 'communityfund',
	port: 3306
});


function createUser(name, email, password) {
	connection.query("INSERT INTO user(email, name, password) VALUES ('" + email + "','" + name + "','" + password + "')",
		function(err, result) {
			if (err) {
				throw err;
			} else {
				console.log("Created user successfully");
			}
		});
}

function checkPassword(password) {

}

function authenticateSignUp(email, password, repassword, callback) {
	connection.query("SELECT email FROM user WHERE email = '" + email + "'", function(err, result) {
	if (err) {
		throw err;
	} else {
		//Check if email already exists
		if (result.length == 0) {

			//Check that passwords match
			if (password == repassword) {
				callback(true);
			}

			//Passwords did not match
			else {
				callback(false);
			}
		}

		//Email already exists
		else {
			callback(false);
		}
	}
});
}

function authenticateLogin(email, password) {

}

exports.createUser = createUser;
exports.authenticateSignUp = authenticateSignUp;
exports.authenticateLogin = authenticateLogin;