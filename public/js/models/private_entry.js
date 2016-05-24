define([
	'backbone'
], function() {
	'use strict';

	var privateEntry = Backbone.Model.extend({
		defaults: {
			sender: '',
			avatar_img: '',
			receiver: '',
			msg: '',
			created: new Date()
		}
	});

	return privateEntry;
});