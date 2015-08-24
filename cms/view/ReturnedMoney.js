define(['jquery', 'underscore', 'backbone', 'text!template/ReturnedMoney.html', 'config/config', 'view/ReturnedMoneyCell', 'model/Contract'], 
	function($, _, Backbone, ReturnedMoneyHtml, Config, ReturnedMoneyCell, ContractModel) {

	var ReturnedMoney = Backbone.View.extend({

		tagName: 'div',

		className: 'returnedMoney',

		template: _.template(ReturnedMoneyHtml),

		initialize: function(options) {
			this.render();
		},

		render: function() {
			this.$el.html(this.template());

			var $returnedMoneyTable = this.$el.find("#returnedMoneyTable tbody");

			$.get(Config.Server("contracts"), function(data, status) {

				_.each(data, function(contract) {

					$returnedMoneyTable.append(
						new ReturnedMoneyCell({

							model : new ContractModel({
							_id			: contract._id,
							myId  		: contract.myId,
							name 		: contract.name,
							partyA		: contract.partyA,
							partyB		: contract.partyB,
							amount		: contract.amount,
							returnAmount: contract.returnAmount,
							returnRatio : contract.returnRatio,
							lastReturnDate: contract.lastReturnDate
							})
							}	
						).el);
				});
			});

			$("#container3").html("");
			$("#container3").append(this.el);
			return this;
		}

	});
	return ReturnedMoney;
});