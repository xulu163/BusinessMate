define(['jquery', 'underscore', 'backbone','config/config', 'model/Contract', 'text!template/ShouldGetMoney.html', 'view/ShouldGetMoneyCell'], 
	function($, _, Backbone,  Config, ContractModel, ShouldGetMoneyHtml,  ShouldGetMoneyCell) {

	var ShouldGetMoney = Backbone.View.extend({

		tagName: 'div',

		className: 'shouldGetMoney',

		template: _.template(ShouldGetMoneyHtml),

		initialize: function(options) {
			this.render();
		},

		render: function() {
			this.$el.html(this.template());
			var $shouldGetMoneyTable = this.$el.find("#shouldGetMoneyTable tbody");

			$.get(Config.Server("contracts"), function(data, status) {

				_.each(data, function(contract) {

					$shouldGetMoneyTable.append(
						new ShouldGetMoneyCell({

							model : new ContractModel({
							_id			: contract._id,
							myId  		: contract.myId,
							name 		: contract.name,
							partyA		: contract.partyA,
							partyB		: contract.partyB,
							amount		: contract.amount,
							submitAmount: "",
							submitRatio : "",
							state		: contract.state 
							})
							}	
						).el);
				});
			});
			$("#container5").html("");
			$("#container5").append(this.el);
			return this;
		}

	});
	return ShouldGetMoney;
});