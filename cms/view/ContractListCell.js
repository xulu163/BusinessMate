define([
		"backbone",
		"jquery",
		"underscore",
		"text!template/ContractListCell.html"
], function(Backbone, $, _, ContractListCellHtml) {

	var ContractListCell = Backbone.View.extend({

		tagName: 'tr',

		template: _.template(ContractListCellHtml),

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
				beginDate 	: this.model.get("beginDate"),
				endDate 	: this.model.get("endDate"),
				state 		: this.model.get("state"),
			}));
		},
	});
	return ContractListCell;
});