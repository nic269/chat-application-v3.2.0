define([
	'text!templates/layer.tpl',
	'views/private_chat/private_entries',
	'common',
	'underscore',
	'jQuery'
], function(LayerTemplate, PrivateEntriesView, Common) {

	function layerView() {

	}

	layerView.prototype.init = function(receiver) {
		// var privateEntriesView = new PrivateEntriesView(receiver);
		// console.log(privateEntriesView.el);

		// this._data = {
		// 	receiver: receiver,
		// 	private_entries: privateEntriesView.el.innerHTML
		// };
	};

	return layerView;
});