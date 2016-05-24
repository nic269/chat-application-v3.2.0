define([
	'text!templates/layer.tpl',
	'views/private_chat/private_entries',
	'common',
	'backbone',
	'jQuery'
], function(LayerTemplate, PrivateEntriesView, Common) {
	//'use strict';

	var layerView = Backbone.View.extend({
		className: 'layer layout-left',

		template: _.template(LayerTemplate),

		events: {
			'click .js-btn-send': 'newMessage',
			'keyup .js-new-msg': 'newMessageWithKey',
			'click .js-layer-close-icon': 'closeLayer',
			'click .js-layer-header': 'minimizedLayer'
		},

		initialize: function(receiver) {
			var that = this;
			var privateEntriesView = new PrivateEntriesView({isFetch: true, receiver: receiver});

			setTimeout(function() {				
				that._data = {
					receiver: receiver,
					private_entries: privateEntriesView.$el[0].outerHTML
				};

				that.render();
			}, 200);
		},

		render: function() {
			this.$el.empty();
			this.$el.html(this.template(this._data));
			this.$el.attr('id', this._data.receiver);
		},

		newMessage: function() {
			var $input_field = this.$('.js-new-msg');
			var input = $input_field.val().trim();
			var receiver = $input_field.data('receiver');

			if (input) {
				socket.emit('newPriMessage', {receiver: receiver, msg: input});
				$input_field.val('');
			} else {
				alert('input your message first');
			}

		},

		newMessageWithKey: function(e) {
			if (e.which === Common.ENTER_KEY) {
				this.newMessage();
			}
		},

		closeLayer: function() {
			this.$el.remove();
		},

		minimizedLayer: function() {
			this.$el.toggleClass('minimized');
		}
	});

	return layerView;
});