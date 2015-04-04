var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Project = require('../models/project');

User.methods(['get', 'put', 'post', 'delete']);
User.register(router, '/users');

Project.methods(['get', 'put', 'post', 'delete']);
Project.register(router, '/project');

module.exports = router;