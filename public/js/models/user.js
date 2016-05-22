define([
	'backbone',
	'jQuery'
], function() {
	'use strict';

	var User = Backbone.Model.extend({
		defaults: {
			user_name: '',
			avatar_img: ''
		}
	});

	return User;
});