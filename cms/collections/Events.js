define([
	'underscore',
	'backbone',
	'model/EventCell'
], function( _, Backbone, EventCell ) {

	var EventsCollection = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: EventCell,
	});

	return new EventsCollection();
});
