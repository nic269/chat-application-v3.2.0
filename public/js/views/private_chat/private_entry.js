define([
	'text!templates/private_entry.tpl',
	'backbone',
	'jQuery'
], function(PrivateEntryTemplate) {
	'use strict';

	var privateEntryView = Backbone.View.extend({
		tagName: 'li',

		className: 'entry b-layout',

		template: _.template(PrivateEntryTemplate),

		render: function() {
			if (this.model.get('sender') === socket.user_name) {
				this.$el.addClass('isme');
			}
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		newMessage: function(data) {
			if (data.sender === socket.user_name) {
				this.$el.addClass('isme');
			}
			this.$el.html(this.template(data));
			return this;
		}
	});

	return privateEntryView;
});