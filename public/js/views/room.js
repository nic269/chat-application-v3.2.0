define([
	'text!templates/room.tpl',
	'backbone',
	'jQuery'
], function(RoomTemplate) {
	'use strict';

	var roomView = Backbone.View.extend({
		tagName: 'li',

		className: 'group',

		template: _.template(RoomTemplate),

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});

	return roomView;
});