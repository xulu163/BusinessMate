var mongoose = require('mongoose'),
	Company = mongoose.model('Company'),
	generator = require('../generator/generator'),
	util = require('../util/common'),
	async = require('async'),
	fs = require('fs'),
	path = require('path'),
	File = mongoose.model('File');


exports.create = function(req, res) {
	console.log("----company add");
	var data = req.body;
	var company = new Company();
	company.create(data, function(data) {

		var company = new Company();
		company.upload(data, function(data) {
			//console.log("dsdfs"+data);
			var occur = new Date();
			var get = {
				cid: data.cid, //合同id
				time: occur, //时间
				getNew: 0, //版本
				data: data
			};
		});
	});
	res.send(data);
}

exports.destroy = function(req, res) {
	console.log("----company delete");
	var cids = req.params['id'];
	var file = new File();
	var path = "";
	var data = cids.split("+");
	var company = new Company();
	var sign = true;
	for (var i = 0; i < data.length; i++) {
		//删除公司
		company.delete(data[i], function(data1) {
			//貌似删除成功model返回的是1
			if (data1 != 1) {
				sign = false;
			}
			//删除公司相关的附件
			path = "./files/" + data[i]
			file.deleteFolder(path, function(data) {});
		});
	}
	sign ? res.send(true) : res.send(false);

};

exports.update = function(req, res) {
	console.log("----company update");
	var company = new Company();
	var result = req.body;
	console.log(result);
	company.update(result.cid, result, function(data) {
		console.log(result);
		console.log("----update success");
		var company = new Company();
		company.upload(result, function(data) {
			//console.log("dsdfs"+data);
			var occur = new Date();
			var get = {
				cid: data.cid, //合同id
				time: occur, //时间
				getNew: 0, //版本
				data: data
			};
		});
	});
	res.send(result);


};

exports.initEdit = function(req, res) {
	console.log("----company init");
	id = req.params['id'];
	var company = new Company();
	company.initEdit(id, function(result) {
		console.log(result);
		res.send(result);
	});
};

exports.show = function(req, res) {
	console.log("----company show");
	var company = new Company();
	var type = req.param('id');
	console.log(type + "?????????");
	company.show(type, function(result) {
		console.log("----show success");
		res.send(result);
	});
};