define([
	'underscore',
	'backbone',
	'model/Template',
	'config/config'
], function( _, Backbone, Template, Config) {

	var TemplateItemsCollection = Backbone.Collection.extend({

		model: Template,
		url: Config.Server('templates'),

	});

	return new TemplateItemsCollection();
});
