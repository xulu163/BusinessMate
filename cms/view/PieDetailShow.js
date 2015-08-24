define([
		"backbone",
		"jquery",
		"underscore",
		"json2",
		'config/config',
		"view/ContractViewAdd",
		"text!template/PieDetialViewHtml.html",
		"view/PieContractListCell",
		"model/Contract"
], function(Backbone, $, _, JSON, Config, ContractViewAdd, PieDetialViewHtml, PieContractListCell, ContractModel) {

	var PieDetailShow = Backbone.View.extend({

		tagName: 'div',

		className: "PieDetailShow",

		template: _.template(PieDetialViewHtml),

		initialize: function(options) {

			//在导航栏上设置成当前选中页。
			$(".active").removeClass();
			$("#contracts").addClass("active");

			this.id = options.id;
			// console.info(this.id);

			this.$containerView = $("#container");

			this.$contracts = new Array();

			this.render();
		},

		render: function() {
			var airline = this.id;
			this.$el.html(this.template());
			var $contractListTable = this.$el.find("#contractListTable tbody");


			$.get(Config.Server("contracts"), function(data, status) {

				_.each(data, function(contract) {
					//这里找出id的所有合同并添加
					if (contract.partyA == airline || contract.partyB == airline) {
						console.info(airline);
						$contractListTable.append(
							new PieContractListCell({
							model: new ContractModel({
								_id: contract._id,
								myId: contract.myId,
								name: contract.name,
								beginDate: contract.beginDate,
								endDate: contract.endDate,
								state: contract.state,
								partyA: contract.partyA,
								partyB: contract.partyB
							}),
						}).el);
					}

				});
			});

			return this;
		}
	});

	return PieDetailShow;
});