var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'Shihan',
	user: 'g3aishih',
	password: 'g3aishih!password',
	database: 'communityfund',
	port: 3306
});


connection.connect();


var s = connection.query('SELECT * FROM users', function(err, result, fields){
	if (err) {
		throw err;
	} else {
		console.log('result: ', result);
	}
});


connection.end();