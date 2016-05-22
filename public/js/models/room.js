define([
	'backbone'
], function() {
	'use strict';

	var Room = Backbone.Model.extend({
		defaults: {
			name: '',
			max_member: '',
			member: ''
		}
	});

	return Room;
});