define([
	'collections/users',
	'views/user',
	'jQuery',
	'backbone'
], function(Users, UserView) {
	'use strict';

	var usersView = Backbone.View.extend({
		tagName: 'ul',

		initialize: function() {
			//this._$user_list = $('.js-user-list');
			socket.on('reloadOnlineList', function() {
				Users.fetch({ reset: true });
			});

			this.listenTo(Users, 'reset', this.render);
		},

		render: function() {
			this.$el.empty();
			Users.each(this.addOneUser, this);
		},

		addOneUser: function(User) {
			var userView = new UserView({ model: User});

			this.$el.append(userView.render().el);
		}
	});

	return usersView;
});