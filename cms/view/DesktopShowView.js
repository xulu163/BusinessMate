define([ "jquery", "underscore", "backbone", 'text!template/DesktopShowView.html','view/ChartShow', 'view/ReturnedMoney' ,'view/WaitBackMoney', 'view/ShouldGetMoney'], 
    function($, _, Backbone, DesktopShowViewHtml, ChartShow, ReturnedMoney, WaitBackMoney,ShouldGetMoney) {

    var DesktopShowView = Backbone.View.extend({

        template: _.template(DesktopShowViewHtml),

        initialize: function(options) {
            $(".active").removeClass();
            $("#desktop").addClass("active");
            this.render();
        },

        events: {
            'click .BusinessInfo': 'BusinessInfo',
            'click .BusinessTrend': 'BusinessTrend',
            'click .WaitMoney': 'WaitMoney',
            'click .ShouldGet': 'ShouldGet'
        },

        render: function() {
            this.$el.html(this.template());
            new ChartShow();
            return this;
        },

        BusinessInfo: function() {
            
        },

        BusinessTrend: function() {
            new ReturnedMoney();
        },

        WaitMoney: function() {
            new WaitBackMoney();
        },

        ShouldGet: function() {
           new ShouldGetMoney();
        }

    });
    return DesktopShowView;
});