define([
	'models/user',
	'backbone',
	'jQuery'
], function(User) {
	'use strict';

	var Users = Backbone.Collection.extend({
		model: User,
		url: '/online-user'
	});

	return new Users();
});