define([
	'views/entries',
	'common',
	'jQuery'
], function(EntriesView, Common) {

	function mainContent() {
		this._$main_content = $('.js-main');
	}

	mainContent.prototype.init = function() {
		var that = this;
		//Render message on world chat
		var $entries = this._$main_content.find('.js-entries');
		var entriesView = new EntriesView({room_name: 'world'});
		$entries.empty();
		$entries.html(entriesView.el);
		//set room active
		socket.room_actived = 'world';

		//Send new message
		var $new_msg_field = this._$main_content.find('.js-new-msg');
		var $btn_new_msg = this._$main_content.find('.js-btn-send');

		$btn_new_msg.on('click', function() {
			that.newMessage();
		});

		$new_msg_field.on('keyup', function(e) {
			if (e.which === Common.ENTER_KEY) {
				that.newMessage();
			}
		});
	};

	mainContent.prototype.newMessage = function() {
		var $new_msg_field = this._$main_content.find('.js-new-msg');
		var input = $new_msg_field.val().trim();
		var room_name = $new_msg_field.data('room');

		if (input) {
			socket.emit('newMessage', {msg: input, room_name: room_name});
			$new_msg_field.val('');
		} else {
			alert('input your message first');
		}
	};

	mainContent.prototype.changeRoom = function(room_name) {
		//Set room name for title and input message
		var $room_name = this._$main_content.find('.js-room-name');
		var $new_msg_field = this._$main_content.find('.js-new-msg');

		$room_name.empty().html('<h3>' + room_name + '</h3>');
		$new_msg_field.attr('data-room', room_name);

		//reload message for new room changed
		var $entries = this._$main_content.find('.js-entries');
		var entriesView = new EntriesView({room_name: room_name});
		$entries.empty();
		$entries.html(entriesView.el);
		//set room active
		socket.room_actived = room_name;
	};

	mainContent.prototype.getRoomName = function() {
		var $new_msg_field = this._$main_content.find('.js-new-msg');
		var room_name = $new_msg_field.data('room');
		return room_name;
	};

	return mainContent;
});