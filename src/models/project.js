//Defines the model for a Project

var restful = require('node-restful');
var mongoose = restful.mongoose;

//Defines the schema for a User
var projectSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	funds: {
		raised: {
			type: Number,
			required: true,
			default: 0
		},
		goal: {
			type: Number,
			required: true
		}
	},
	numFunders: {
		type: Number,
		default: 0
	},
	category: {
		type: Array,
		default: []
	},
	location: {
		type: Array,
		default: []
	},
	comments: {
		type: Array,
		required: false,
		default: []
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
	rating: {
		likes: {
			type: Number,
			default: 0
		},
		dislikes: {
			type: Number,
			default: 0
		}
	},
	author: {
		id: String,
		name: String,
		email: String
	}
}, {
	versionKey: false
});

module.exports = restful.model('Projects', projectSchema);