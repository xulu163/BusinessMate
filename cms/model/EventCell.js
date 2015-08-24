define([
	'underscore',
	'backbone'
], function( _, Backbone ) {

	var EventModel = Backbone.Model.extend({

		defaults: {
			id:'',
			type:'',
			title: '',
			date: '',
			price:'',
			remark:'',
			completed:false,
		},


	});

	return EventModel;
});
