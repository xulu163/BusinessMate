define(['jquery', 'underscore', 'backbone', 'config/config', 'model/Contract', 'text!template/WaitBackMoney.html', 'view/WaitBackMoneyCell'], 
	function($, _, Backbone, Config, ContractModel, WaitBackMoneyHtml, WaitBackMoneyCell) {

	var WaitBackMoney = Backbone.View.extend({

		tagName: 'div',

		className: 'waitBackMoney',

		template: _.template(WaitBackMoneyHtml),

		initialize: function(options) {
			this.render();
		},

		render: function() {
			this.$el.html(this.template());
			var $waitBackMoneyTable = this.$el.find("#waitBackMoneyTable tbody");

			$.get(Config.Server("contracts"), function(data, status) {

				_.each(data, function(contract) {

					$waitBackMoneyTable.append(
						new WaitBackMoneyCell({

							model : new ContractModel({
							_id			: contract._id,
							myId  		: contract.myId,
							name 		: contract.name,
							partyA		: contract.partyA,
							partyB		: contract.partyB,
							amount		: contract.amount,
							submitAmount: "",
							submitRatio : "",
							submitDate	: "",
							state		: contract.state 
							})
							}	
						).el);
				});
			});
			$("#container4").html("");
			$("#container4").append(this.el);
			return this;
		}

	});
	return WaitBackMoney;
});