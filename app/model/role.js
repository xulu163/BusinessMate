/**
 * Module dependencies.
 *
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Repository = require('./repository');

/////role模型
var RoleSchema = mongoose.Schema({ //角色模型
	role: String //角色
});

RoleSchema.methods = {

	test: function() {
		console.info("=======test");
	},

	insertData: function(rdata, callback) { //添加角色记录

		console.log("insert successfully");
		Role = this.model('Role');
		var role = new Role(rdata);
		role.save();
		callback("insertRole successfully.");
	},

	findAllRole: function(callback) {

		console.log("find all role");
		Role = this.model('Role');
		Role.find({}, function(err, results) {
			callback(results);
		});
	},

	findOneRole: function(id, callback) {

		console.log("find all role");
		Role = this.model('Role');
		Role.find({
			_id: id
		}, function(err, results) {
			callback(results);
		});
	},

	updateData: function(id, getRole, callback) {

		console.log("update one role");
		Role = this.model('Role');
		console.log(id);
		Role.update({
			_id: id
		}, getRole, function() {
			Role.find({
				_id: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	removeData: function(id, callback) {

		console.log("update one role");
		Role = this.model('Role');
		Role.remove({
			_id: id
		}, function(err, result) {
			callback("success" + result);
		});
	}
};

mongoose.model('Role', RoleSchema); //创建新文件对象,并关联到模型