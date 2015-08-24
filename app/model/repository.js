var _ = require('underscore');

moongoseMethods = {

	findById: function(id) {
		console.info("findById:" + id);
	},

	findAll: function() {
		console.info("findAll");
	},

	findByProperty: function(property, value) {

	},
	
	deleteById: function() {

	}
};

exports.enhanceSchema = function(schema) {
	_.extend(schema.methods, moongoseMethods);
};