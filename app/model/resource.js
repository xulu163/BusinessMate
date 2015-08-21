var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Repository = require('./repository');

/////resouce模型
var resourceSchema = mongoose.Schema({
	rid: String,
	resource: String,
	url: String
});

resourceSchema.methods = {

	insertData: function(rdata, callback) { //添加资源记录

		resource = this.model('Resource');
		var resource = new resource(rdata);
		resource.save();
		callback("insertResource successfull！");
	},

	findResource: function(callback) {

		resource = this.model('Resource');
		resource.find({}, {
			resource: 1,
			url: 1
		}, function(err, data) {
			callback(data);
		});
	},

	updateData: function(id, rdata, callback) {

		Resource = this.model('Resource');
		Resource.update({
			_id: id
		}, rdata, function() {
			Resource.find({
				_id: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	removeResource: function(id, callback) {

		Resource = this.model('Resource');
		Resource.remove({
			_id: id
		}, function() {
			Resource.find({
				_id: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	findResourceById: function(id, callback) {

		resource = this.model('Resource');
		resource.find({
			_id: id
		}, {
			resource: 1,
			url: 1
		}, function(err, data) {
			callback(data);
		});
	}
};

mongoose.model('Resource', resourceSchema); //创建新文件对象,并关联到模型