define([
		"backbone",
		"jquery",
		"underscore",
		"json2",
		'config/config',
		"view/ContractViewAdd",
		"text!template/ContractListView.html",
		"view/ContractListCell",
		"model/Contract"
], function(Backbone, $, _, JSON, Config,ContractViewAdd, ContractListViewHtml, ContractListCell, ContractModel) {

	var ContractListView = Backbone.View.extend({

		tagName: 'div',

		className: "ContractListView",

		template: _.template(ContractListViewHtml),

		initialize: function(options) {

			//在导航栏上设置成当前选中页。
			$(".active").removeClass();
			$("#contracts").addClass("active");

			this.$containerView = $("#container");
			this.$searchInput = $(".contractIdInput");

			this.$contracts = new Array();

			this.render();
		},

		events: {
			'click #addContractBtn'			: 'onAddContractBtnClick',
			'click #searchBtn'				: 'onSearchBtnClick',
		},


		render: function() {

			this.$el.html(this.template());
			var $contractListTable = this.$el.find("#contractListTable tbody");


			$.get(Config.Server("contracts"), function(data, status) {

				console.info("成功加载数据");

				_.each(data, function(contract) {

					$contractListTable.append(
						new ContractListCell({
							model : new ContractModel({
							_id 		: contract._id,
							myId  		: contract.myId,
							name 		: contract.name,
							beginDate 	: contract.beginDate,
							endDate 	: contract.endDate,
							state 		: contract.state}),
							}	
						).el);

				});
			});

			return this;
		},
		presentView: function(view) {
			this.$containerView.append(view.el);
			this.remove();
		},
		onAddContractBtnClick: function() {


		},
		onSearchBtnClick: function() {

		}
	});

	return ContractListView;
});