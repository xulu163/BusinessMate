define([
	'underscore',
	'backbone',
	'config/config'
], function( _, Backbone, Config) {

	var ContractModel = Backbone.Model.extend({

		urlRoot:Config.Server("contracts"),

		idAttribute: "_id",

		defaults: {
			myId 			:null,
			name			:null,
			partyA 			:null,
			partyB 			:null,
			returnRatio		:null,
			returnAmount	:null,
			lastReturnDate	:null,
			signDate		:null,
			beginDate 		:null,
			endDate 		:null,
			amount			:null,
			state 			:null,
			events 			:[]
		},

		convertToContract:function(template){
			this.set('myId',template.get('myId'));
			this.set('name',template.get('name'));
			this.set('partyA',template.get('partyA'));
			this.set('partyB',template.get('partyB'));
			this.set('signDate',template.get('signDate'));
			this.set('beginDate',template.get('beginDate'));
			this.set('endDate',template.get('endDate'));
			this.set('amount',template.get('amount'));
			this.set('state',template.get('state'));
			this.set('events',template.get('events'));
		},


	});

	return ContractModel;
});
