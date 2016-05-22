define([
	'blocks/side_bar',
	'jQuery',
	'backbone'
], function(BlockSidebar) {
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
		},

		logOut: function() {
			console.log('logout');
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