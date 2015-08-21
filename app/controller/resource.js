var async = require('async'),
	mongoose = require('mongoose'),
	Resource = mongoose.model('Resource'),
	RoleResource = mongoose.model('RoleResource');

exports.showResource = function(req, res) {
	var item = req.query.item;
	var index = req.query.index;
	var begin = item * (index - 1);
	var end = item * index - 1;
	var resource = new Resource();
	var newData = [];
	resource.findResource(function(data) {
		if (item == null) {
			res.send(data);
		} else {
			var sendData = [];
			var k = 0;
			for (var i = begin; i < end + 1; i++) {
				if (i < data.length) {
					sendData[k] = data[i];
					k++;
				}
			}
			console.log("========sendData========");
			console.log(sendData);
			var getSendData = {
				count: data.length,
				data: sendData
			};
			res.send(getSendData);
		}
	});
};

exports.create = function(req, res) {
	var resource = req.body.resource;
	var url = req.body.url;

	var data = {
		resource: resource,
		url: url
	};
	var resourceModel = new Resource();
	resourceModel.insertData(data, function(tdata) {
		console.info(tdata);
		res.send(tdata);
	});
}

exports.update = function(req, res) {
	var resource = req.body.resource;
	var url = req.body.url;
	var rid = req.params['id'];
	var data = {
		resource: resource,
		url: url
	};

	//首先从resource表中拿到id为rid的资源，去roleresource中先更新与此资源相同的项，再更新resource表
	var resourceModel = new Resource();
	resourceModel.findResourceById(rid, function(result) {

		var roleresource = new RoleResource();
		roleresource.findRoleResource(function(tdata) {
			for (var i = 0; i < tdata.length; i++) {
				var length = tdata[i].resource.length;
				var toUpdate = false;

				if (length != undefined) {
					for (var j = 0; j < length; j++) {

						if (tdata[i].resource[j] != null && tdata[i].resource[j].opername == result[0].resource) {
							tdata[i].resource[j].resource = data.url;
							tdata[i].resource[j].opername = data.resource;
							toUpdate = true;
						}
					}
				}

				if (toUpdate) {
					var putData = {
						role: tdata[i].role,
						resource: tdata[i].resource
					};
					var rolename = tdata[i].role;
					roleresource.updateOneRoleResouce(rolename, putData, function(ttdata) {

						resourceModel.updateData(rid, data, function(tdata) {
							console.info(tdata);
							res.send(tdata);
						});
					});
				}
			}

			//如果该资源没有在任何角色中添加，这直接在resource表中进行修改
			if (i == tdata.length) {
				resourceModel.updateData(rid, data, function(tdata) {
					console.info(tdata);
					res.send(tdata);
				});
			}
		});
	});
}

exports.destroy = function(req, res) {
	var rdata = req.body;
	var resource = new Resource();
	var rid = req.params['id'];
	var roleresource = new RoleResource();
	roleresource.findRoleResource(function(tdata) {

		for (var i = 0; i < tdata.length; i++) {
			var length = tdata[i].resource.length;
			var toUpdate = false;
			var index;

			if (length != undefined) {
				for (var j = 0; j < length; j++) {

					if (tdata[i].resource[j] != null && tdata[i].resource[j].opername == rdata.resource) {

						index = j;
						toUpdate = true; //使用update作为delete作用
					}
				}
			}

			if (toUpdate) {
				if (index < length - 1) {
					for (; index < length; index++) {
						tdata[i].resource[index] = tdata[i].resource[index + 1];
						tdata[i].resource[length - 1] = null;
					}
				} else
					tdata[i].resource[index] = null;

				//因为删除时不能更改数组长度，所以使用新的数组装resource
				var resourceArr = new Array();
				for (var i = 0; i < length; i++) {
					if (tdata[i].resource[i] != null)
						resourceArr.push(tdata[i].resource[i]);
				}

				var putData = {
					role: tdata[i].role,
					resource: resourceArr
				};

				var rolename = tdata[i].role;
				roleresource.updateOneRoleResouce(rolename, putData, function(ttdata) {
					resource.removeResource(rid, function(data) {
						console.log("remove resource successfully");
						res.send("result:" + data);
					});
				});
			}
		}

		//如果执行到这里，说明在roleresource中没有角色添加了该资源，直接在resource表中删除
		if (i == tdata.length) {
			resource.removeResource(rid, function(data) {
				console.log("remove resource successfully");

				res.send("result:" + data);
			});
		}
	});
}