var async = require('async'),
	mongoose = require('mongoose'),
	UserRole = mongoose.model('UserRole');

exports.index = function(req, res) { //获取用户-角色记录
	console.log("role index");
	var userRole = new UserRole();
	userRole.findAll(function(data) {
		console.log(data);
		res.send(data);
	});
};

exports.show = function(req, res) {
	console.log("user-role show");
	var userRole = new UserRole();
	var uid = req.params['id'] + '';
	userRole.findOne(uid, function(data) {
		console.log(data);
		res.send(data);
	});
};

exports.create = function(req, res) { //添加用户-角色记录
	console.log("user-role creat");
	var getData = req.body;
	var userRole = new UserRole();
	var get = {
		uid: getData.uid,
		username: getData.username,
		realname: getData.realname,
		role: getData.role
	};
	userRole.insertData(get, function(data) {
		res.send(data);
	});
};

exports.update = function(req, res) { //修改用户-角色记录
	console.log("user-role update");
};

exports.getUser = function(req, res) {
	var roleArr = req.params['roles'].split(",");
	var userRole = new UserRole();
	userRole.checkUser(roleArr, function(data) {
		res.send(data);
	});
}

exports.test = function(req, res) {
	console.log("user-role test");
	var userRole = new UserRole();
	var get = {
		uid: "20130609213326087",
		username: "caiyidong",
		role: ["admin", "boss"]
	};
	userRole.insertData(get, function(data) {
		console.log(data);
	});
};

exports.selUser = function(req, res) {
	var rolename = req.params['rolename'] + '';
	console.log("rolename = " + rolename);
	var userRole = new UserRole();
	userRole.checkUser(rolename, function(data) {
		console.log("====selUser=====data====");
		console.log(data);
		res.send(data);
	})
};