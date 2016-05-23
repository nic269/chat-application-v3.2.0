define([
	'backbone'
], function() {
	'use strict';
	Backbone.Model.prototype.idAttribute = '_id';
	
	var Room = Backbone.Model.extend({
		defaults: {
			name: '',
			max_member: '',
			member: ''
		}
	});

	return Room;
});