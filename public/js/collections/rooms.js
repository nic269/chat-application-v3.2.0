define([
	'models/room',
	'backbone'
], function(Room) {
	'use strict';

	var Rooms = Backbone.Collection.extend({
		model: Room,
		url: '/room'
	});

	return new Rooms();
});