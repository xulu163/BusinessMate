define(['view/ContractListView', 'view/ContractViewAdd', 'view/DesktopShowView', 'view/PieDetailShow'], function(ContractListView, ContractViewAdd, DesktopShowView, PieDetailShow) {
	var MainRouter = Backbone.Router.extend({
		routes: {
			"": "index",
			"contracts": "contracts",
			"addContract":"addContract",
			"editContract/:id":"editContract",
			"BusinessInfo": "BusinessInfo",
			"BusinessTrend":"BusinessTrend",
			"pieDetial/:id": "PieDetail",
			"test":"test.html"
			"addContract": "addContract",
			"editContract/:id": "editContract",
			"pieDetial/:id": "PieDetail"

		},

		currentView: "",

		containerView: "",

		initialize: function(options) {
			this.containerView = options.containerView;
		},

		index: function() {
			this.switchView(new DesktopShowView());
		},
		contracts: function() {
			this.switchView(new ContractListView());
		},
		addContract: function() {
			this.switchView(new ContractViewAdd({
				mode: 'add'
			}));
		},
		editContract: function(id) {
			this.switchView(new ContractViewAdd({
				mode: 'edit',
				id: id
			}));
		},
		PieDetail: function(id) {
			this.switchView(new PieDetailShow({
				id: id
			}));
		},
		switchView: function(view) {

			if (this.currentView != "") {
				this.currentView.remove();
			}

			this.currentView = view;
			this.containerView.append(view.el);
		}
	});

	return MainRouter;
});
