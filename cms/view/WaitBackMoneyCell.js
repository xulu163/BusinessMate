define([
		"backbone",
		"jquery",
		"underscore",
		"text!template/WaitBackMoneyCell.html"
], function(Backbone, $, _, WaitBackMoneyCellHtml) {

	var ContractListCell = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(WaitBackMoneyCellHtml),

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
				submitDate	: this.model.get("submitDate"),
				state 		: this.model.get("state")
			}));
		},
	});
	return ContractListCell;
});