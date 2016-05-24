define([
	'text!templates/user.tpl',
	'blocks/chat_dock',
	'jQuery',
	'backbone'
], function(UserTemplate, BlockChatDock) {
	'use strict';

	var userView = Backbone.View.extend({
		tagName: 'li',

		className: 'user b-layout',

		template: _.template(UserTemplate),

		events: {
			'click .js-name': 'openChat'
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		openChat: function() {
			var receiver = this.$('.js-name a').data('name');
			if (receiver !== socket.user_name) {
				var blockChatDock = new BlockChatDock();
				// check this receiver has opened chat box or not
				var $receiver = blockChatDock._$chat_dock.find('#' + receiver);
				if ($receiver.length) {
					// this receiver has been opened chat box by sender
					var $input_msg = $receiver.find('.js-new-msg');
					$input_msg.focus();
				} else {
					// this receiver hasn't yet opened chat box by sender
					blockChatDock.openChat(receiver);
				}

			}
		}
	});

	return userView;
});