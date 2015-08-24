define([
		"backbone",
		"jquery",
		"underscore",
		"text!template/ShouldGetMoneyCell.html"
], function(Backbone, $, _, ShouldGetMoneyCellHtml) {

	var ShouldGetMoneyCell = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(ShouldGetMoneyCellHtml),

		model: null,

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(
				this.template({
				_id 		: this.model.id,
				myId  		: this.model.get("myId"),
				name 		: this.model.get("name"),
				partyA	 	: this.model.get("partyA"),
				partyB	 	: this.model.get("partyB"),
				amount	 	: this.model.get("amount"),
				submitAmount: this.model.get("submitAmount"),
				submitRatio	: this.model.get("submitRatio"),
				state 		: this.model.get("state")
			}));
		},
	});
	return ShouldGetMoneyCell;
});