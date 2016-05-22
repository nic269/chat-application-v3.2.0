define([
	'models/entry',
	'backbone'
], function(Entry) {
	'use strict';

	var Entries = Backbone.Collection.extend({
		model: Entry,
		url: '/chat-history'
	});

	return new Entries();
});