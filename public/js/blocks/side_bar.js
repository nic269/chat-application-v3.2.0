define([
	'views/users',
	'views/rooms',
	'new_room',
	'jQuery'
], function(UsersView, RoomsView, NewRoom) {

	function Sidebar() {
		this._$side_bar = $('.js-side-bar');
	}

	Sidebar.prototype.init = function() {
		this.tabEvent();
		this.renderUserList();
		this.renderRoomList();
		this.roomEvents();
	};

	Sidebar.prototype.tabEvent = function() {
		var $private_chat = this._$side_bar.find('.js-private-chat');
		var $users_list = this._$side_bar.find('.js-users-list');
		var $group_chat = this._$side_bar.find('.js-group-chat');
		var $groups_list = this._$side_bar.find('.js-groups-list');
		var $tab_link = this._$side_bar.find('.tab-link');

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

	Sidebar.prototype.renderUserList = function() {
		var $users_list = this._$side_bar.find('.js-users-list');

		// Render online user list
		var usersView = new UsersView();
		$users_list.empty();
		$users_list.html(usersView.el);
	};

	Sidebar.prototype.renderRoomList = function() {
		var $room_list = this._$side_bar.find('.js-groups-list');
		var create_room = $('<div/>', {
			class: 'create-group'
		}).html('<button class="btn-create-group"><i class="fa fa-plus" aria-hidden="true"></i></button>');

		// Render room list
		var roomsView = new RoomsView();
		$room_list.find('ul').remove();
		$room_list.append(roomsView.el);
	};

	Sidebar.prototype.roomEvents = function() {
		var $btn_create_room = this._$side_bar.find('.js-btn-create-group');

		$btn_create_room.on('click', function() {
			var newRoom = new NewRoom();
			newRoom.init();
		});
	};

	return Sidebar;
});