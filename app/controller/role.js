var async = require('async'),
	mongoose = require('mongoose'),
	Role = mongoose.model('Role'),
	RoleResource = mongoose.model('RoleResource');


exports.index = function(req, res){   //获取角色记录
	console.log("role index");
	var role = new Role();
	role.findAllRole(function(data){
		res.send(data);
	});
};

exports.pagesel = function(req, res) {
	console.log("role-pagesel");
	var index = req.body.index;       //拿到第几页
	var item = req.body.item;         //拿到每页多少条
	var begin = item*(index-1);       //
	var end = item*index - 1;
	var role = new Role();
	role.findAllRole(function(data){
		var sendData = [];
		var k = 0;
		for (var i = begin; i < end+1; i++){
			if(i < data.length) {
				sendData[k] = data[i];
				k++;
			}
		}
		var getSendData = {
			count : data.length,
			data : sendData
		};
		res.send(getSendData);
	})
};

exports.show = function(req,res){    //角色

	var role = new Role();
	var getData = req.body;
    var roleid = req.params['id'];
    role.findOneRole(roleid, function(data){
    	res.send(data);
    });
};

exports.create = function(req, res){  //添加角色记录
	
	var getData = req.body;
	var role = new Role();
	var get = {
		role: getData.role
	};
	role.insertData(get,function(data){
		console.log(data);
		res.send(data);
	});
};

exports.update = function(req, res){  //修改角色记录
	
	console.log("user-role update");
	var role = new Role();
	var getData = req.body;
    var roleid = req.params['id'];
    getRole={
    	role:getData.role
    }
    role.updateData(roleid, getRole, function(data){
    	res.send(data);
    });
};

exports.destroy = function(req,res){

	console.log("destroy one role");
	var role = new Role();
	var roleResource = new RoleResource();
	var userRole = new UserRole();
	var roleid = req.params['id'];
	var rolename = req.body.role;
	var users = req.body.data;
	userRole.removeUserRole(users, rolename, function(result){
		// console.log("===destroy====removeUserRole===");
		role.removeData(roleid, function(data){
			roleResource.removeOneRoleResource(rolename, function(data){
				res.send(data);
			});
		});
	});
}

exports.test = function(req, res){
	console.log("user-role test");
};