define([
	'backbone'
], function() {
	'use strict';

	var Entry = Backbone.Model.extend({
		defaults: {
			sender: '',
			avatar_img: '',
			msg: '',
			room_name: '',
			created: new Date()
		}
	});

	return Entry;
});