//Defines the model for a User 

var restful = require('node-restful');
var mongoose = restful.mongoose;

//Defines the schema for a User
var userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	login: {
		email: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		password: {
			type: String,
			required: true
		}
	},
	date: {
		dateObj: {
			type: Date,
			default: Date.now
		},
		parsedDate: {
			type: String
		}	
	},
	comments: {
		type: Array,
		required: false,
		default: []
	},
	preferences: {
		interests: {
			type: Array,
			default: []
		},
		location: {
			type: Array,
			default: []
		}
	},
	projects: {
		funding: {
			type: Array,
			default: []
		},
		initated: {
			type: Array,
			default: []
		}
	},
	rated: {
		likes: [{
			type: String,
			index: {
				unique: true
			},
			default: []
		}],
		dislikes: [{
			type: String,
			index: {
				unique: true
			},
			default: []
		}]
	},
	rating: {
		likes: {
			type: Number,
			default: 0
		},
		dislikes: {
			type: Number,
			default: 0
		}
	}
}, {
	versionKey: false
});

module.exports = restful.model('Users', userSchema);