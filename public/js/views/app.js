define([
	'blocks/side_bar',
	'blocks/main_content',
	'jQuery',
	'backbone'
], function(BlockSidebar, BlockMainContent) {
	'use strict';

	var appView = Backbone.View.extend({
		el: '.js-chat-app',

		events: {
			'click .js-logout': 'logOut'
		},

		initialize: function() {
			this._server_url = 'http://dev.node:7000';

			var blockSidebar = new BlockSidebar();
			blockSidebar.init();

			var blockMainContent = new BlockMainContent();
			blockMainContent.init();

			socket.on('setClientInfo', function(data) {
				this.user_name = data.user_name,
				this.avatar_img = data.avatar_img
			});
		},

		logOut: function() {
			$.get(this._server_url + '/logout', function(data) {
				if (typeof(data) === 'object' && data.status === 'done') {
					socket.emit('onDisconnect', data.user_name);
					socket.on('onDisconnect', function(status) {
						if (status === 'done') {
							window.location.href = '/';
						}
					});
				} else if (data === 'done') {
					window.location.href = '/';
				}
			});
		}
	});

	return appView;
});