define([
	'models/private_entry',
	'backbone'
], function(PrivateEntry) {
	'use strict';

	var privateEntries = Backbone.Collection.extend({
		model: PrivateEntry,
		url: '/private-chat'
	});

	return new privateEntries();
});