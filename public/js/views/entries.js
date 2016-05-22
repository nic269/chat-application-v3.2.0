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

		initialize: function() {
			var that = this;

			socket.on('newMessage', function(data) {
				that.addNewMessage(data);
			});

			socket.on('Notice', function(data) {
				if (data.type === 'join') {
					that.addNotice('<span>' + data.user_name + '</span> has joined');
				} else if (data.type === 'left') {
					that.addNotice('<span>' + data.user_name + '</span> has left');
				}
			});

			Entries.fetch({ reset: true });

			this.listenTo(Entries, 'reset', this.render);
		},

		render: function() {
			this.$el.empty();
			Entries.each(this.addOneMsg, this);
			this.time();
		},

		addOneMsg: function(entry) {
			var entryView = new EntryView({ model: entry });

			this.$el.append(entryView.render().el);
		},

		addNotice: function(text) {
			var notice = $('<li/>').html('<p class="notice">' + text + '</p>');

			this.$el.prepend(notice);
		},

		addNewMessage: function(data) {
			var entryView = new EntryView();
			entryView.newMessage(data);

			this.$el.prepend(entryView.el);
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