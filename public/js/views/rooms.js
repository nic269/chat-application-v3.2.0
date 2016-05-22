define([
	'collections/rooms',
	'views/room',
	'backbone',
	'jQuery'
], function(Rooms, RoomView) {
	'use strict';

	var roomsView = Backbone.View.extend({
		tagName: 'ul',

		initialize: function() {
			socket.on('reloadRoomList', function() {
				Rooms.fetch({ reset: true });
			});

			this.listenTo(Rooms, 'reset', this.render);
		},

		render: function() {
			this.$el.empty();
			Rooms.each(this.addOneRoom, this);
		},

		addOneRoom: function(Room) {
			var roomView = new RoomView({ model: Room });

			this.$el.append(roomView.render().el);
		}
	});

	return roomsView;
});