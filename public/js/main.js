(function() {
	require.config(
	{
		waitSeconds: 200,
		baseUrl: 'js/',
		paths: {
			domReady: 'libs/dom-ready/domReady',
			jQuery: 'libs/jquery-1.12.0.min',
			underscore: 'libs/underscore/underscore',
			text: 'libs/requirejs-text/text',
		},
		shim: {

		}
	});

	require([
		'domReady',
		'animate.lib',
		'signup',
		'login'
	], function(domReady, AnimateLib, Signup, Login) {
		var animate = new AnimateLib();

		animate.autoloadAnimation('.js-welcome', 'zoomInDown');
		animate.autoloadAnimation('.js-app-name', 'bounceInRight', 1000);
		animate.autoloadAnimation('.js-action', 'flipInX', 2000);

		Login.init();
		Signup.init();
		
	});
})();