define([
		"backbone",
		"jquery",
		"underscore",
		"text!template/ReturnedMoneyCell.html"
], function(Backbone, $, _, ReturnedMoneyCellHtml) {

	var ReturnedMoneyCell = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(ReturnedMoneyCellHtml),

		model: null,

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(
				this.template({
				_id			: this.model.id,
				myId  		: this.model.get("myId"),
				name 		: this.model.get("name"),
				partyA		: this.model.get("partyA"),
				partyB		: this.model.get("partyB"),
				amount		: this.model.get("amount"),
				returnAmount: this.model.get("returnAmount"),
				returnRatio : this.model.get("returnRatio"),
				lastReturnDate: this.model.get("lastReturnDate")
			}));
		},
	});
	return ReturnedMoneyCell;
});