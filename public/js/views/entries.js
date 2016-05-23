define([
	'collections/entries',
	'views/entry',
	'models/entry',
	'libs/timeago/timeago',
	'backbone',
	'jQuery'
], function(Entries, EntryView, Entry, TimeAgo) {
	'use strict';

	var EntriesView = Backbone.View.extend({
		tagName: 'ul',

		initialize: function(options) {
			var that = this;
			this._options = options || '';

			socket.on('newMessage', function(data) {
				that.addNewMessage(data);
			});

			socket.on('Notice', function(data) {
				if (data.type === 'join') {
					that.addNotice('<span>' + data.user_name + '</span> has joined', data.room_name);
				} else if (data.type === 'left') {
					that.addNotice('<span>' + data.user_name + '</span> has left', data.room_name);
				}
			});

			if (this._options !== '') {
				Entries.fetch({ reset: true, data: {name: this._options.room_name} });
			} else {
				Entries.fetch({ reset: true, data: {name: 'world'} });
			}

			this.listenTo(Entries, 'reset', this.render);
		},

		render: function() {
			this.$el.empty();
			Entries.each(this.addOneMsg, this);
			this.time();
		},

		addOneMsg: function(entry) {
			var entryView;
			var room_name = entry.get('room_name');

			if (this._options === '') {
				if (room_name === 'world') {

					entryView = new EntryView({ model: entry });
					this.$el.append(entryView.render().el);
				}
			} else {
				if (room_name === this._options.room_name) {

					entryView = new EntryView({ model: entry });
					this.$el.append(entryView.render().el);
				}
			}
		},

		addNotice: function(text, room_name) {
			var notice = $('<li/>').html('<p class="notice">' + text + '</p>');
			//if user have opened chat room as room_name
			if (room_name === socket.room_actived) {
				this.$el.prepend(notice);
			}
		},

		addNewMessage: function(data) {
			//if user have opened chat room as room_name
			if (data.room_name === socket.room_actived) {
				var entryView = new EntryView();
				entryView.newMessage(data);

				this.$el.prepend(entryView.el);
			}
			this.time();
		},

		time: function() {
			var $time = this.$('time');

			$time.each(function() {
				$(this).text($.timeago($(this).attr('title')));
			});
		},
	});

	return EntriesView;
});