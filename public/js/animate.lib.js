define([
	'jQuery'
], function() {

	function animateLib() {}

	animateLib.prototype.autoloadAnimation = function(el, animation, timeDelay) {
		var $el = $(el);
		var add_class = 'animated ' + animation;
		var time_delay = timeDelay || 0;
		
		setTimeout(function() {
			$el.show().addClass(add_class) ;
		}, time_delay);

		//wait for animation to finish and removing classes
		setTimeout(function() {
			$el.removeClass(add_class);
		}, time_delay + 2000);
	};

	return animateLib;
});