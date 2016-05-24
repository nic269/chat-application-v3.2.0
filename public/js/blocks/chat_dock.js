define([
	'views/private_chat/layer',
	'views/private_chat/private_entry',
	'jQuery'
], function(LayerView, PrivateEntryView) {

	function chatDock() {
		this._$chat_dock = $('.js-chat-dock');
		//this._receiver = receiver;
	}

	chatDock.prototype.init = function(receiver) {
		
	};

	chatDock.prototype.addNewMessage = function(data) {
		var privateEntryView, $receiver, $chat_box;
		
		if (data.sender === socket.user_name) {
			//case: this socket is sender
			console.log('render message for sender');

			$receiver = this._$chat_dock.find('#' + data.receiver);
			$chat_box = $receiver.find('.js-layer-content ul');

			privateEntryView = new PrivateEntryView();
			console.log($chat_box);
			$chat_box.prepend(privateEntryView.newMessage(data).el);
		} else {
			if (data.receiver === socket.user_name) {
				$receiver = this._$chat_dock.find('#' + data.sender);

				if (!$receiver.length) {
					//case: this socket isn't sender but not yet open chat box with sender
					console.log('render message for receiver don\'t open chat');

					this.openChat(data.sender);
				} else {

					//case: this socket isn't sender but have opened chat box with sender
					console.log('render message for receiver have opened chat');

					$chat_box = $receiver.find('.js-layer-content ul');

					privateEntryView = new PrivateEntryView();
					$chat_box.prepend(privateEntryView.newMessage(data).el);
				}
			}
		}
	};

	chatDock.prototype.openChat = function(receiver) {
		var layerView = new LayerView(receiver);

		this._$chat_dock.append(layerView.el);
	};

	return chatDock;
});