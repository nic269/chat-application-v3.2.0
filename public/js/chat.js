(function() {
	require.config({
		waitSeconds: 200,
		baseUrl: 'js/',
		paths: {
			domReady: 'libs/dom-ready/domReady',
			jQuery: 'libs/jquery-1.12.0.min',
			underscore: 'libs/underscore/underscore',
			text: 'libs/requirejs-text/text',
			backbone: 'libs/backbone/backbone',
			socket: '/socket.io/socket.io'
		},
		shim: {
			backbone: {
				deps: [
					'underscore',
					'jQuery'
				],
				exports: 'Backbone'
			},
			socket: {
				exports: 'io'
			}
		}
	});

	require([
		'domReady',
		'routes/router',
		'views/app',
		'socket',
		'backbone'
	], function(domReady, Router, AppView, io) {

		domReady(function() {
			new Router();
			Backbone.history.start();

			socket = io.connect();

			new AppView();
		});
	});
})();