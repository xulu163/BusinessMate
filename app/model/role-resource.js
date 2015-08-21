/**
 * Module dependencies.

          user1   *                         permissions(requireRole,requireGroup)
                   *                                     ++++      
          user2   ******** role1 ******   oper(get,post,del,put)-obc1 (特定角色指定)
                   *              *   
                  *                 *
          user3  *                    *   oper(get,post,del,put)-obc2 (特定角色组指定)
                  *                 *
                   *              *
          user4   ******** role2 ******   oper(get,post,del,put)-obc3 (特定角色指定)
                   *
          user5   *
 *
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Repository = require('./repository');

/////role-resouce模型
var RoleResourceSchema = mongoose.Schema({ //角色模型
	role: String, //角色
	resource: Array //拥有的资源
});

RoleResourceSchema.methods = {

	test: function() {
		console.info("=======test");
	},

	insertData: function(rdata, callback) { //添加用户-角色记录

		console.log("insert successfully");
		RoleResource = this.model('RoleResource');
		var roleResource = new RoleResource(rdata);
		roleResource.save();
		callback("insertResource successfully.");
	},

	findRoleResource: function(callback) {

		console.log("findRoleResource..");
		RoleResource = this.model('RoleResource');
		RoleResource.find({}, function(err, results) {
			callback(results);
		});
	},

	findRolesResource: function(roles, callback) { //查找多个角色的资源

		RoleResource = this.model('RoleResource');
		var sendResource = [];
		var index = 0;
		RoleResource.find({}, function(err, results) {
			results.forEach(function(result) {
				for (var i = 0; i < roles.length; i++) {
					if (result.role == roles[i]) {
						var resource = result.resource;
						if (resource != null && resource.length != 0) {
							for (var j = 0; j < resource.length; j++) {
								sendResource[index] = resource[j];
								index++;
							}
						}
					}
				}
			});
			callback(sendResource);
		});
	},

	findOneRoleResource: function(role, callback) {

		console.log("findOneRoleResource..");
		RoleResource = this.model('RoleResource');
		RoleResource.find({
			role: role
		}, function(err, results) {
			callback(results);
		});
	},

	checkResource: function(role, callback) {

		console.log("checkResource");
		RoleResource = this.model('RoleResource');
		var send = [];
		RoleResource.find({
			role: role
		}, function(err, results) {
			if (results.length != 0) {
				var get = results[0].resource;
				send = get;
				callback(send);
			}
			if (results.length == 0) {
				callback(send);
			}
		});
	},

	updateOneRoleResouce: function(rolename, result, callback) {

		console.log("update role-resource");
		RoleResource = this.model('RoleResource');
		RoleResource.update({
			role: rolename
		}, result, function() {
			RoleResource.find({
				role: rolename
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	removeOneRoleResource: function(rolename, callback) {

		console.log("remove role-resource");
		RoleResource = this.model('RoleResource');
		RoleResource.remove({
			role: rolename
		}, function() {
			RoleResource.find({
				role: rolename
			}, function(err, docs) {
				callback(docs);
			});
		});
	}
};

mongoose.model('RoleResource', RoleResourceSchema); //创建新文件对象,并关联到模型