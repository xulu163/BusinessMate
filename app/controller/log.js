var async = require('async'),
	mongoose = require('mongoose'),
	Contractshistory = mongoose.model('Contractshistory'),
	Operationlog = mongoose.model('Operationlog');

exports.userShow = function(req, res) { //返回所有访问日志

	var operationlog = new Operationlog();
	var index = req.query.index; //拿到第几页
	var item = req.query.item; //拿到每页多少条
	var begin = item * (index - 1); //
	var end = item * index - 1;
	console.log("index");
	operationlog.findAll(function(data) {
		var sendData = [];
		var k = 0;
		for (var i = begin; i < end + 1; i++) {
			if (i < data.length) {
				sendData[k] = data[i];
				k++;
			}
		}
		var getSendData = {
			count: data.length,
			data: sendData
		};
		res.send(getSendData);
	});
};

exports.oneUserShow = function(req, res) { //返回所有访问日志

	var operationlog = new Operationlog();
	var queryId = req.params['id'];
	console.log("index");
	operationlog.findOne(queryId, function(data) {
		res.send(data);
	});
};

exports.businessShow = function(req, res) { //返回所有业务日志

	var contractshistory = new Contractshistory();
	contractshistory.findAllBusiness(function(data) {
		res.send(data);
	});
};

exports.businessGetOne = function(req, res) {
	var contractshistory = new Contractshistory();
	var contractId = req.params['id'];
	var versionId = req.params['version'];
	contractshistory.findOneBusiness(contractId, versionId, function(data) {
		var roles = req.session.roles;
		var events = [];
		var name = req.user.username;
		//遍历合同，如果事件经办人是自己，则取出该事件并将关联的合同信息返回
		if (roles == ['corpoBusinessAssistant'] || roles == ['regionalAssistant'] || roles == ['corpoBusinessAssistant', 'regionalAssistant']) {
			for (var i = 0; i < data.length; i++) {
				for (var j = 0; j < data[i].events.length; j++) {
					if (data[i].events.customEve_person == name || data[i].events.priceEve_person1 == name || data[i].events.priceEve_person2 == name) {
						events.push(data[i].events);
					}
				}
				data[i].events = events;
			}
		}
		res.send(data);
	});
};

exports.businessDestroy = function(req, res) {
	var contractshistory = new Contractshistory();
	var contractId = req.params['id'];
	var versionId = req.params['versionId'];
	contractshistory.removeVersion(contractId, versionId, function(data) {
		console.log(data);
		res.send(data);
	});
};

exports.businessOfOne = function(req, res) {
	var contractshistory = new Contractshistory();
	var contractId = req.params['id'];
	contractshistory.findOneGroup(contractId, function(data) {
		res.send(data);
	});
};

exports.testBusiness = function(req, res) {
	var contractshistory = new Contractshistory();
	var contractId = req.params['id'];
	var versionId = req.params['version'];
	console.log(contractId);
	console.log(versionId);
	contractshistory.removeVersion(contractId, versionId, function(data) {
		console.log(data[0]);
		res.send(data[0]);
	});
};

exports.showLog = function(req, res) { //分页
	var operationlog = new Operationlog();

	var index = req.query.index; //拿到第几页
	var item = req.query.item; //拿到每页多少条
	var skip = item * index;
	console.log("index");

	operationlog.findLimit(skip, item, function(data) {
		res.send(data);
	});
};