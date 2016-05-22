define([
	'text!templates/new_room.tpl',
	'popup',
	'jQuery'
], function(NewRoomTemplate, Popup) {
	function newRoom() {

	}

	newRoom.prototype.init = function() {
		var that = this;

		var popup = new Popup();
		var data = {
			'title': 'Create New Room',
			'content': NewRoomTemplate
		};

		popup.init({
			class: 'newroom-popup',
			data: data
		});

		var $new_room = $('.newroom-popup');
		var $name_field = $new_room.find('.js-name');
		var $max_member_field = $new_room.find('.js-max-member');
		var $btn_create_room = $new_room.find('.js-add-room');

		this._$new_room = $new_room.find('.js-new-room');

		$btn_create_room.on('click', function() {
			if (!$name_field.val().trim() || !$max_member_field.val().trim()) {
				that.addError('Please fill all field');
			}

			var member = [];
			member.push(socket.user_name);

			var data = {
				name: $name_field.val(),
				creator: socket.user_name,
				max_member: $max_member_field.val(),
				member: member
			};

			$.post('http://dev.node:7000/room', {data: data}, function(res) {
				if (res === 'done') {
					popup.closePopup();
				} else {
					that.addError(res);
					return;
				}
			});
		});
	};

	newRoom.prototype.addError = function(error) {
		var error_area = $('<p/>', {
			class: 'error'
		}).html(error + '<span class="error-close"><i class="fa fa-times" aria-hidden="true"></i></span>');
		this._$new_room.prepend(error_area);
	};

	return newRoom;
});