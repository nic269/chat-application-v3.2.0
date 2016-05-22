define([
	'views/users',
	'jQuery'
], function(UsersView) {

	function Sidebar() {
		this._$side_bar = $('.js-side-bar');
	}

	Sidebar.prototype.init = function() {
		var $private_chat = this._$side_bar.find('.js-private-chat');
		var $users_list = this._$side_bar.find('.js-users-list');
		var $group_chat = this._$side_bar.find('.js-group-chat');
		var $groups_list = this._$side_bar.find('.js-groups-list');
		var $tab_link = this._$side_bar.find('.tab-link');

		// Render online user list
		var usersView = new UsersView();
		$users_list.empty();
		$users_list.html(usersView.el);

		//Event for tab link
		$private_chat.on('click', function() {
			$tab_link.removeClass('active');
			$(this).parent().addClass('active');

			$groups_list.removeClass('active');
			$users_list.addClass('active');
			return false;
		});

		$group_chat.on('click', function() {
			$tab_link.removeClass('active');
			$(this).parent().addClass('active');

			$users_list.removeClass('active');
			$groups_list.addClass('active');
			return false;
		});

	};

	return Sidebar;
});