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

/////user-role模型
var UserRoleSchema = mongoose.Schema({ //角色模型
	uid: String, //uer id
	username: String, //用户名
	realname: String, //真实姓名
	role: Array //角色
});

UserRoleSchema.methods = {

	test: function() {
		console.info("=======test");
	},

	findAll: function(callback) { //找出所有用户-角色记录

		console.log("find all user-roles");
		UserRole = this.model('UserRole');
		UserRole.find({}, function(err, results) {
			callback(results);
		});
	},

	findOne: function(uid, callback) { //找出指定用户-角色完整记录

		console.log("find one user-roles");
		UserRole = this.model('UserRole');
		UserRole.find({
			uid: uid
		}, function(err, results) {
			callback(results);
		});
	},

	checkRole: function(uid, callback) { //找出特定用户所分配的角色字段

		console.log("checkRole");
		UserRole = this.model('UserRole');
		var send = [];
		UserRole.find({
			uid: uid
		}, function(err, results) {
			if (results.length != 0) {
				var get = results[0];
				send = get.role;
				callback(send);
			}
			if (results.length == 0) {
				callback(send);
			}
		});
	},

	checkUser: function(role, callback) { ///找出拥有特定角色的用户

		// console.log("checkUser");
		UserRole = this.model('UserRole');
		var send = [];
		var j = 0;
		UserRole.find({}, function(err, results) {
			results.forEach(function(result) {
				// var user={};
				for (var t = 0; t < role.length; t++) {
					for (var i = 0; i < result.role.length; i++) {
						if (result.role[i] == role[t]) {
							var user = {};
							user.username = result.username;
							user.realname = result.realname;
							user.role = role[t];
							send.push(user);
						}
					}
				}
			});
			callback(send);
		});
	},

	insertData: function(rdata, callback) { //添加用户-角色记录

		console.log("insert successfully");
		UserRole = this.model('UserRole');
		var userRole = new UserRole(rdata);
		userRole.save();
		callback("insertRole successfully.");
	},

	updateUserRole: function(id, result, callback) {

		console.log("update user-role");
		UserRole = this.model('UserRole');
		UserRole.update({
			uid: id
		}, result, function() {
			UserRole.find({
				uid: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	removeData: function(uid, callback) {

		console.log("remove user-role");
		UserRole = this.model('UserRole');
		UserRole.find({
			uid: uid
		}, function(err, userRole) {
			if (userRole.length != 0) {
				UserRole.remove({
					uid: uid
				}, function(err, data) {
					callback(data);
				});
			} else {
				console.log("the user have't role yet.");
				callback("the user have't role yet.");
			}
		});
	},

	removeUserRole: function(users, rolename, callback) {
		UserRole = this.model('UserRole');
		users.forEach(function(user) {
			UserRole.find({
				username: user
			}, function(err, result) {
				if (result.length != 0) {
					var role = result[0].role;
					var newRole = [];
					var k = 0;
					for (var i = 0; i < role.length; i++) {
						if (role[i] != rolename) {
							newRole[k] = role[i];
							k++;
						}
					}

					result[0].role = newRole;
					var newResult = {
						usename: result[0].username,
						role: newRole,
						uid: result[0].uid
					};

					UserRole.update({
						username: user
					}, newResult, function(err, updatResult) {
						callback(result[0]);
					});
				}
			});
		})
	},

	checkRoleName: function(username, callback) { //找出特定用户名所分配的角色字段

		console.log("checkRoleName");
		UserRole = this.model('UserRole');
		var send = [];
		console.log("ii", username);
		UserRole.find({
			username: username
		}, function(err, results) {
			if (results.length != 0) {
				var get = results[0];
				send = get.role;
				console.log("oo", send);
				callback(send);
			}
			if (results.length == 0) {
				console.log("oo", send);
				callback(send);
			}
		});
	},

	updateUserRole: function(id, result, callback) {
		UserRole = this.model('UserRole');
		UserRole.update({
			uid: id
		}, result, function() {
			UserRole.find({
				uid: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	}
};

mongoose.model('UserRole', UserRoleSchema); //创建新文件对象,并关联到模型