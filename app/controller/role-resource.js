var async = require('async'),
	mongoose = require('mongoose'),
	RoleResource = mongoose.model('RoleResource');
UserRole = mongoose.model('UserRole');

exports.index = function(req, res) {

	console.log("role-resource index");
	var roleResource = new RoleResource();
	roleResource.findRoleResource(function(data) {
		// console.log(data);
		res.send(data);
	});
};

exports.show = function(req, res) {

	var roleResource = new RoleResource();
	var role = req.body.role;
	roleResource.findOneRoleResource(role, function(data) {
		// console.log(data);
		res.send(data);
	});
};

exports.create = function(req, res) {

	var getData = req.body;
	var roleResource = new RoleResource();
	var get = {
		role: getData.role,
		resource: getData.resource
	};
	// console.log(get);
	roleResource.insertData(get, function(data) {
		console.log(data);
		res.send(data);
	});
};

exports.update = function(req, res) {

	console.log("role-resource update");
	var getData = req.body;
	var rolename = getData.role;
	var roleResource = new RoleResource();
	var getResource1 = getData.resource; //要把重复资源去除掉
	if (getResource1 == undefined) {
		console.log("oh no");
		var get = {
			role: getData.role,
			resource: []
		};
		roleResource.updateOneRoleResouce(rolename, get, function(data) {
			console.log(data);
			res.send(data);
		});
	} else {
		var resourceUnique = [];
		var r = 0;

		for (var i = 0; i < getResource1.length; i++) {
			var temp = getResource1[i];
			var flag = 0;
			for (var j = 0; j < resourceUnique.length; j++) {
				if (temp.opername == resourceUnique[j].opername && temp.oper == resourceUnique[j].oper && temp.resource == resourceUnique[j].resource) {
					flag = 1;
					console.log("good");
				}
			}
			if (flag == 0) {
				resourceUnique.push(getResource1[i]);
			}
		}

		var get = {
			role: getData.role,
			resource: resourceUnique
		};
		roleResource.updateOneRoleResouce(rolename, get, function(data) {
			console.log(data);
			res.send(data);
		});
	}
};

exports.test = function(req, res) {

	console.log("role-resource test");
	var getData = req.body;
	var rolename = "admin";
	var roleResource = new RoleResource();
	var get = {
		role: "admin",
		resource: [{
			"opername": "合同操作",
			"oper": "post",
			"resource": "/api/contracts"
		}, {
			"opername": "合同操作",
			"oper": "get",
			"resource": "/api/contracts"
		}]
	};
	// console.log(get);
	roleResource.updateOneRoleResouce(rolename, get, function(data) {
		// console.log(data);
		res.send(data);
	});
};

exports.init = function(status, roles) {
	var newRoles = [];
	if (status == "salers") {
		newRoles.push("salers");
	} else {
		for (var i = 0; i < roles.length; i++) {
			if (roles[i] != "salers") {
				newRoles.push(roles[i]);
			}
		}
	}
	return newRoles;
};

exports.sidenav = function(req, res) {
	var uid = req.user.uid;
	var userRole = new UserRole();
	var roleResource = new RoleResource();
	var status = req.session.status;
	userRole.checkRole(uid, function(Roles) {
		var roles = exports.init(status, Roles);
		var sendData = [];
		var index = 0;
		if (roles != null && roles.length != 0) {
			roleResource.findRolesResource(roles, function(data) {
				console.log("======sidenav======data==========");

				if (data != null && data.length != 0) {
					for (var i = 0; i < data.length; i++) {
						if (data[i] != null) {
							var url = data[i].resource;
							sendData[index] = url;
							index++;
						}
					}
				}
				var get = {
					data: data,
					sendData: sendData
				};
				res.send(get);
			});
		} else {
			res.send(null);
		}
	});
};

exports.userResources = function(req, res) {
	var uid = req.user.uid;
	var userRole = new UserRole();
	var roleResource = new RoleResource();
	userRole.checkRole(uid, function(roles) {

	});
};