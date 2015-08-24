define(["backbone",
	"jquery",
	"underscore",
	"text!template/EventCellCustom.html",
	"text!template/EventCellPrice.html",
	"model/EventCell"
	],function(Backbone,$,_,EventCellCustomHtml,EventCellPriceHtml,EventModel){

	var EventView = Backbone.View.extend({

		tagName : 'li',

		className : "form-signin",

		model:new EventModel(),

		initialize: function(){

			if(this.model.get('type') == '1') {
				this.template = _.template(EventCellCustomHtml);
			} else {
				this.template = _.template(EventCellPriceHtml);
			}

			this.render();
		},

		events : {
			'click #destroy' : 'deleteEventCell',
			'keydown #appendedPrependedInput' : 'priceInputValidate'
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON())); 
			return this;
		},

		deleteEventCell: function() {
			this.trigger('delete',this.model.id);
			this.remove();
		},

		priceInputValidate:function(val){

			if(val.keyCode == 8)
				return true;

			if(val.keyCode < 48 || val.keyCode > 57)
				return false;

			
		},

		toJson:function(){

			return {
			'id'			: this.model.get("id"),
			'title'			: this.$el.find("input[id^='eventName']").val(),
			'date'			: this.$el.find("#completedTime").val(),
			'remark'		: this.$el.find("#remark").val(),
			'price'			: this.$el.find("#appendedPrependedInput").val() == null ? -1 : this.$el.find("#appendedPrependedInput").val(),
			'completed'		: this.model.get("completed")
				};
		}

	});

	return EventView;

});