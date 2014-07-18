'use strict';
require('../models/user.server.model.js');
var config = require('../../config/config.js'),
	prompt = require('prompt'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

var db = mongoose.connect(config.db);

var schema = {
	properties: {
		firstName: {
			description: 'First Name',
			type: 'string',
			pattern: /^[a-zA-Z\s\-]+$/,
			message: 'Name must only contain letters, spaces, or dashes\nName must contain at least two (2) characters',
			required: true,
			minLength: 2
		},
		lastName: {
			description: 'Last Name',
			type: 'string',
			pattern: /^[a-zA-Z\s\-]+$/,
			message: 'Name must only contain letters, spaces, or dashes\nName must contain at least two (2) characters',
			required: true,
			minLength: 2
		},
		email: {
			description: 'E-Mail',
			type: 'string',
			format: 'email',
			message: 'Please enter a valid E-Mail address',
			required: true
		},
		username: {
			description: 'User Name',
			type: 'string',
			pattern: /^[a-zA-Z\-\_]+$/,
			message: 'Name must only contain letters, underscores or dashes\nName must contain at least two (2) characters',
			required: true,
			minLength: 2
		},
		password: {
			description: 'Password',
			type: 'string',
			minLength: 6,
			message: 'Password must be at least 6 characters long',
			required: true,
			hidden: true
		}
	}
};

prompt.start();

prompt.get(schema, function (err, result) {
	if (err) { return onErr(err); }
	var user = new User(result);

	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	user.save(function(err) {
		if (err) {
			return onErr(err);
		} else {
			user.password = undefined;
			user.salt = undefined;

			console.log('User ' + user.username + ' created!');
		}
	});
	return 0;
});

function onErr(err) {
	console.log(err);
	return 1;
}