define([
	'text!templates/user.tpl',
	'jQuery',
	'backbone'
], function(UserTemplate) {
	'use strict';

	var userView = Backbone.View.extend({
		tagName: 'li',

		className: 'user b-layout',

		template: _.template(UserTemplate),

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}

	});

	return userView;
});