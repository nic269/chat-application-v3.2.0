define([
	'text!templates/room.tpl',
	'blocks/main_content',
	'views/entries',
	'backbone',
	'jQuery'
], function(RoomTemplate, BlockMainContent, EntriesView) {
	'use strict';

	var roomView = Backbone.View.extend({
		tagName: 'li',

		className: 'group',

		template: _.template(RoomTemplate),

		events: {
			'click .js-btn-left': 'leftRoom',
			'click .js-btn-join': 'joinRoom',
			'click .js-btn-delete': 'deleteRoom',
			'click .js-group-name': 'startChat'
		},

		initialize: function() {
			var that = this;
			socket.on('changeToDefaultRoom', function(old_room) {
				that.changeToDefaultRoom(old_room);
			});
			
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function() {
			//this.$el.empty();
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		leftRoom: function() {
			var member = this.model.get('member');
			var room_name = this.model.get('name');

			var index = member.indexOf(socket.user_name);
			member.splice(index, 1);
			this.model.trigger('change');
			this.model.save({member: member});
			// Change to default room
			var blockMainContent = new BlockMainContent();
			blockMainContent.changeRoom('world');
			//push server talk all user about left notify
			socket.emit('Notice', {type: 'left', room_name: room_name});
		},

		joinRoom: function() {
			var member = this.model.get('member');
			var room_name = this.model.get('name');

			if (member.indexOf(socket.user_name) === -1) {
				member.push(socket.user_name);
				this.model.trigger('change');
				this.model.save({member: member});
				// Change to room have just joined and start to chat in there
				var blockMainContent = new BlockMainContent();
				blockMainContent.changeRoom(room_name);
				//push server talk all user about join notify
				socket.emit('Notice', {type: 'join', room_name: room_name});
			}
		},

		deleteRoom: function() {
			var room_name = this.model.get('name');
			//Push all user in this room : this room deleted and change them to default room
			socket.emit('changeToDefaultRoom', room_name);

			if (socket.room_actived === room_name) {
				// Change to default room
				var blockMainContent = new BlockMainContent();
				blockMainContent.changeRoom('world');
			}
			this.model.destroy();
			socket.emit('reloadRoomList');
		},

		startChat: function() {
			var member = this.model.get('member');

			if (member.indexOf(socket.user_name) !== -1){
				// Change to room have just choose and start to chat in there
				var blockMainContent = new BlockMainContent();
				blockMainContent.changeRoom(this.model.get('name'));
			} else {
				alert('You haven\'t join this room yet');
			}
		},

		changeToDefaultRoom: function(old_room) {
			if (socket.room_actived === old_room) {
				// Change to default room
				var blockMainContent = new BlockMainContent();
				blockMainContent.changeRoom('world');
			}
		}
	});

	return roomView;
});