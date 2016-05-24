define([
	'collections/private_entries',
	'views/private_chat/private_entry',
	'blocks/chat_dock',
	'backbone',
	'jQuery'
], function(PrivateEntries, PrivateEntryView, BlockChatDock) {
	'use strict';

	var privateEntriesView = Backbone.View.extend({
		tagName: 'ul',

		initialize: function(options) {
			var that = this;

			if (options.isFetch) {
				PrivateEntries.fetch({ reset: true, data: {sender: socket.user_name, receiver: options.receiver} });
			}
			this.listenTo(PrivateEntries, 'reset', this.render);
		},

		render: function() {
			this.$el.empty();
			PrivateEntries.each(this.addOneMsg, this);
		},

		addOneMsg: function(privateEntry) {
			var privateEntryView = new PrivateEntryView({ model: privateEntry });
			this.$el.append(privateEntryView.render().el);
		},

		addNewOneMsg: function(data) {
			var privateEntryView = new PrivateEntryView();
			this.$el.append(privateEntryView.newMessage(data).el);
		}
	});

	return privateEntriesView;
});