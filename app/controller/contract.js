/***
 *  合同操作接口
 *  第二期上线
 *
 ****/

var async = require('async'),
	mongoose = require('mongoose'),
	Contract = mongoose.model('Contract'),
	Contractshistory = mongoose.model('Contractshistory'),
	Operationlog = mongoose.model('Operationlog'),
	fs = require('fs'),
	path = require('path'),
	File = mongoose.model('File'),
	nodeExcel = require('excel-export');
var util = require('./util');

//------------------------testData--------------
exports.testData = function(req, res) {
	// console.log("rule:");
	var rule = [];
	if (req.session.rule == undefined || req.session.rule == null) {
		//console.log('hello');
		rule = [{}];
	} else {
		rule = req.session.rule;
	}
	var rules = {
		$or: rule
	};
	// console.log("rules:");
	// console.log(rules);
	var contract = new Contract();
	contract.all(rules, function(data) {
		// console.log(rules);
		res.send(data);
	});
};
//----------------------test end----------
exports.query = function(req, res) {
	var id = req.params['id'];
	var contract = new Contract();
	contract.checkIdData({
		'_id': id
	}, function(data) {
		// console.log(1);
		res.send(data);
	});
};

//根据id获取基本信息
exports.checkOneBasic = function(req, res) {
	var contract = new Contract();
	var id = req.params['id'] + '';
	// console.log(id+"---------------------");
	contract.checkOneBasic(id, function(data) {
		// console.log("data:---------"+data);
		res.send(data);
	});
};

//根据合同名获取信息列表
exports.checkListBasic = function(req, res) {
	var contract = new Contract();
	var name = req.params['name'] + '';
	contract.checkListBasic(name, function(data) {
		// console.log(data);
		res.send(data);
	});
};

//获取全部合同信息列表
exports.checkDetailData = function(req, res) {
	var contract = new Contract();
	var name = req.params['name'] + '';
	contract.checkDetailData(name, function(data) {
		// console.log(data);
		res.send(data);
	});
};

exports.pageSearch = function(req, res) {
	var occur = new Date();
	var contract = new Contract();
	// console.log("show");
	var data = req.params['info'] + '';
	data = JSON.parse(data);
	var queryId = data.searchData;
	var pageData = data.pageData;
	var index = pageData.index;
	var item = pageData.item;
	var sortType = pageData.sortType;
	var order = pageData.order;
	var rule = [];
	if (req.session.rule == undefined || req.session.rule == null) {
		//console.log('hello');
		rule = [{}];
	} else {
		rule = req.session.rule;
	}
	if (queryId.searchType === "simple") {
		// console.log("checkIdData");
		contract.simpleSearch(rule, queryId, function(data) {
			var roles = req.session.roles;
			var name = req.user.username;
			if (roles[0] == 'corpoBusinessAssistant' || roles[0] == 'regionalAssistant' || (roles[0] == 'corpoBusinessAssistant' && roles[1] == 'regionalAssistant') || (roles[0] == 'regionalAssistant' && roles[1] == 'corpoBusinessAssistant')) {
				// console.log(11);
				for (var i = 0; i < data.length; i++) {
					var events = [];
					for (var j = 0; j < data[i].events.length; j++) {
						if (data[i].events[j].customEve_person == name || data[i].events[j].priceEve_person1 == name || data[i].events[j].priceEve_person2 == name) {
							events.push(data[i].events[j]);
						}
					}
					data[i].events = events;
				}
			}
			contract.pagination(data, index, item, sortType, order, function(returnData) {
				res.send(returnData);
			});
		});
	} else if (queryId.searchType === "complex") {
		console.log("fuzzySearch");
		contract.fuzzySearch(rule, queryId, function(data) {
			//遍历合同，如果事件经办人是自己，则取出该事件并将关联的合同信息返回
			var roles = req.session.roles;
			var name = req.user.username;
			if (roles[0] == 'corpoBusinessAssistant' || roles[0] == 'regionalAssistant' || (roles[0] == 'corpoBusinessAssistant' && roles[1] == 'regionalAssistant') || (roles[0] == 'regionalAssistant' && roles[1] == 'corpoBusinessAssistant')) {
				// console.log(11);
				for (var i = 0; i < data.length; i++) {
					var events = [];
					for (var j = 0; j < data[i].events.length; j++) {
						if (data[i].events[j].customEve_person == name || data[i].events[j].priceEve_person1 == name || data[i].events[j].priceEve_person2 == name) {
							events.push(data[i].events[j]);
						}
					}
					data[i].events = events;
				}
			}
			contract.pagination(data, index, item, sortType, order, function(returnData) {
				res.send(returnData);
			});
		});
	}
}

//返回合同列表分页数据
exports.pageData = function(req, res) {
	var contract = new Contract();
	var index = req.body.index; //拿到第几页
	var item = req.body.item; //拿到每页多少条
	var sortType = req.body.sortType; //按什么字段比较数据进行排序
	var order = req.body.order; //排序的顺序（升或降）
	contract.checkInfo(function(data) {
		contract.pagination(data, index, item, sortType, order, function(returnData) {
			res.send(returnData);
		});
		/*  按分页参数返回所需数据*/
	});
};

exports.index = function(req, res) {
	// console.log('index');
	var occur = new Date();
	// console.log(occur);
	var contract = new Contract();
	contract.checkInfo(function(data) {
		res.send(data);
	});
};

exports.indexDesktop = function(req, res) {
	// console.log('index');
	var occur = new Date();
	var rule = req.session.desktopRule;
	var rules = {
		$or: rule
	};
	var contract = new Contract();
	contract.checkInfoData(rules, function(data) {
		res.send(data);
	});
};


exports.show = function(req, res) {
	var occur = new Date();
	// console.log(occur);
	var contract = new Contract();
	var queryId = req.params['id'] + '';
	if (queryId.length == 24) {
		var getId = {
			_id: queryId
		};
		contract.checkIdData(getId, function(data) {
			var roles = req.session.roles;
			var name = req.user.username;
			if (roles[0] == 'corpoBusinessAssistant' || roles[0] == 'regionalAssistant' || (roles[0] == 'corpoBusinessAssistant' && roles[1] == 'regionalAssistant') || (roles[0] == 'regionalAssistant' && roles[1] == 'corpoBusinessAssistant')) {

				for (var i = 0; i < data.length; i++) {
					var events = [];
					for (var j = 0; j < data[i].events.length; j++) {
						if (data[i].events[j].customEve_person == name || data[i].events[j].priceEve_person1 == name || data[i].events[j].priceEve_person2 == name) {
							events.push(data[i].events[j]);
						}
					}
					data[i].events = events;
				}


			}
			return res.send(data[0]);
		});
	} else {
		console.log("fuzzySearch");
		contract.fuzzySearch(queryId, function(data) {
			var roles = req.session.roles;
			var events = [];
			var name = req.user.username;
			//遍历合同，如果事件经办人是自己，则取出该事件并将关联的合同信息返回
			if (roles[0] == 'corpoBusinessAssistant' || roles[0] == 'regionalAssistant' || (roles[0] == 'corpoBusinessAssistant' && roles[1] == 'regionalAssistant') || (roles[0] == 'regionalAssistant' && roles[1] == 'corpoBusinessAssistant')) {

				for (var i = 0; i < data.length; i++) {
					var events = [];
					for (var j = 0; j < data[i].events.length; j++) {
						if (data[i].events[j].customEve_person == name || data[i].events[j].priceEve_person1 == name || data[i].events[j].priceEve_person2 == name) {
							events.push(data[i].events[j]);
						}
					}
					data[i].events = events;
				}
				return res.send(data[0]);
			}
		});
	}
};

//--------------------system api begin-------------------------
exports.rout = function(req, res) {
	if (req.query.type) {
		console.log("checkByParam");
		exports.checkByParam(req, res);
	} else {
		exports.show(req, res);
	}
};

//根据type判断是详细信息还是基本信息，通过id查询
exports.checkByParam = function(req, res) {
	var type = "";
	if (req.query.type) {
		type = req.query.type;
	} else {
		type = "detail";
	}
	var param = req.params['id'];
	var contract = new Contract();
	var reg1 = new RegExp("^[a-zA-Z0-9]\{24\}"); //正则验证id
	if (reg1.test(param)) { //如果是id，就按id查询
		var id = param;
		var getId = {
			_id: id
		};

		switch (type) { //按类型查找，基本信息或详细信息		
			case 'basic':
				contract.checkOneBasic(getId, function(data) {
					// console.log(data);
					res.send(data);
				});
				break;
			case 'detail':
				contract.checkIdData(getId, function(data) {
					// console.log(data);
					res.send(data);
				});
				break;
		}
	} else { //如果不是id,那就是name,就按name查询
		var name = param;
		switch (type) { //根据类型判断是详细信息还是基本信息
			case 'basic':
				contract.checkListBasic(name, function(data) {
					// console.log(data);
					res.send(data);
				});
				break;
			case 'detail':
				contract.checkDetailDataByName(name, function(data) {
					// console.log(data);
					res.send(data);
				});
				break;
		}
	}
};
//--------------------system api end---------------------------

exports.create = function(req, res) {
	console.log('login', req.user);
	var occur = new Date();
	// console.log(req);
	// console.log(occur);
	var contract = new Contract();
	var contractshistory = new Contractshistory();
	var rdata = req.body;
	var events = rdata.events;
	var amount = rdata.amount;
	var ratio = 0;
	var returnPrice = 0; //回款事件已回款金额
	if (events != null && events.length != 0) {
		for (var i = 0; i < events.length; i++) {
			if (events[i].price > 0) {
				//页面返回的数据都是String类型，必须将金额转换为number类型才能够计算
				var eventPrice = +events[i].price;
				if (events[i].completed == "true") {
					returnPrice += eventPrice;
				}
			}
		}
	}
	if (amount != 0) {
		ratio = returnPrice / amount;
	}
	var saveData = {
		uid: req.user.uid, //用户id,对应用户模型的uid
		myId: rdata.myId, //合同编号
		partyA: rdata.partyA, //签署甲方
		partyAabbr: rdata.partyAabbr,
		partyADept: rdata.partyADept,
		partyB: rdata.partyB, //签署乙方
		partyBabbr: rdata.partyBabbr,
		partyBDept: rdata.partyBDept,
		amount: rdata.amount, //金额
		returnRatio: ratio, //回款比率
		returnAmount: returnPrice, //回款金额
		lastReturnDate: rdata.lastReturnDate, //上次回款日期
		signDate: rdata.signDate, //签署日期
		name: rdata.name, //合同名称
		tName: rdata.tName, //合同模版名称
		beginDate: rdata.beginDate, //开始日期
		endDate: rdata.endDate, //结束日期
		events: rdata.events, //合同事件
		purchases: rdata.purchases, //采购
		state: "已中标", //合同状态
		next: rdata.next, //待办任务
		file: rdata.file,
		contract_person: rdata.contract_person, //合同录入人
		sals_person: rdata.sals_person, //销售负责人
		business_person: rdata.business_person, //商务负责人
		contract_dept: rdata.contract_dept,
		contract_character: rdata.contract_character //合同性质
	};
	if (saveData.myId == undefined || saveData.name == undefined || saveData.partyA == undefined || saveData.partyB == undefined || saveData.amount == undefined || saveData.signDate == undefined || saveData.beginDate == undefined || saveData.endDate == undefined) {
		res.send({
			error: "fail insert"
		});
	} else {
		contract.insertData(saveData, function(identify) {
			console.log("starting....");
			// console.log(identify);
			var contract = new Contract();
			contract.upload(saveData.file, identify[0]._id, function(data) {
				var occur = new Date();
				var get = {
					contractName: saveData.name,
					contractId: identify[0]._id, //合同id
					time: occur, //时间
					getNew: 0, //版本
					data: saveData
				};
				contractshistory.insertBusiness(get, function(data) {
					res.send({
						hello: "success insert"
					});
				});
			});
		});
	}
};

exports.updateAll = function(req, res) {
	var contract = new Contract();
	contract.checkInfo(function(data) {
		console.log('----------updataAll------------');
		if (data != null && data.length != 0) {
			console.log("data.length = " + data.length);
			for (var k = 0; k < data.length; k++) {
				var conData = data[k];
				var events = conData.events;
				var amount = conData.amount;
				var ratio = 0;
				var returnPrice = 0; //回款事件已回款金额
				if (events != null && events.length != 0) {
					for (var i = 0; i < events.length; i++) {
						if (events[i].price > 0) {
							var eventPrice = events[i].price;
							// console.log("eventPrice = " + eventPrice);
							if (events[i].completed) {
								returnPrice += eventPrice;
							}
						}
					}
				}
				if (amount != 0) {
					ratio = returnPrice / amount;
				}
				var getNew = {
					uid: req.user.uid, //用户id,对应用户模型的uid
					myId: conData.myId,
					partyA: conData.partyA,
					partyAabbr: conData.partyAabbr,
					partyADept: conData.partyADept,
					partyB: conData.partyB,
					partyBabbr: conData.partyBabbr,
					partyBDept: conData.partyBDept,
					name: conData.name,
					beginDate: conData.beginDate,
					endDate: conData.endDate,
					signDate: conData.signDate,
					amount: conData.amount,
					contract_person: conData.contract_person,
					sals_person: conData.sals_person,
					business_person: conData.business_person,
					contract_dept: conData.contract_dept,
					events: conData.events,
					state: conData.state,
					purchases: conData.purchases,
					file: conData.file,
					returnRatio: ratio, //回款比率
					returnAmount: returnPrice, //回款金额
				};
				// console.log(get.file);
				if (getNew.events == null) {
					getNew.events = [];
				}
				if (getNew.purchases == null) {
					getNew.purchases = [];
				}
				var getId = {
					_id: conData._id
				};
				contract.updateIdData(getId, getNew, function(data) {
					contract.upload(getNew.file, conData._id, function(data1) {
						res.send("updat all success");
					});
				});
			}
		}
	});
}

exports.update = function(req, res) {
	var occur = new Date();
	// console.log(occur);
	var contract = new Contract();
	var contractshistory = new Contractshistory();
	console.log("update ......");
	var getId = {
		_id: req.params['id']
	};
	var get = req.body;
	var events = get.events;
	var amount = get.amount;
	var ratio = 0;
	var returnPrice = 0; //回款事件已回款金额
	if (events != null && events.length != 0) {
		for (var i = 0; i < events.length; i++) {
			if (events[i].price > 0) {
				//页面返回的数据都是String类型，必须将金额转换为number类型才能够计算
				var eventPrice = +events[i].price;
				// console.log("eventPrice = " + eventPrice);
				if (events[i].completed == "true") {
					returnPrice += eventPrice;
				}
			}
		}
	}
	if (amount != 0) {
		ratio = returnPrice / amount;
	}
	var getNew = {
		uid: req.user.uid, //用户id,对应用户模型的uid
		myId: get.myId,
		partyA: get.partyA,
		partyAabbr: get.partyAabbr,
		partyADept: get.partyADept,
		partyB: get.partyB,
		partyBabbr: get.partyBabbr,
		partyBDept: get.partyBDept,
		name: get.name,
		beginDate: get.beginDate,
		endDate: get.endDate,
		signDate: get.signDate,
		amount: get.amount,
		contract_person: get.contract_person,
		sals_person: get.sals_person,
		contract_character: get.contract_character,
		business_person: get.business_person,
		contract_dept: get.contract_dept,
		events: get.events,
		state: get.state,
		purchases: get.purchases,
		file: get.file,
		returnRatio: ratio, //回款比率
		returnAmount: returnPrice, //回款金额
	};
	// console.log(get.file);
	if (getNew.events == null) {
		getNew.events = [];
	}
	if (getNew.purchases == null) {
		getNew.purchases = [];
	}
	if (getNew.myId == undefined || getNew.partyADept == undefined || getNew.partyBDept == undefined || getNew.name == undefined || getNew.partyA == undefined || getNew.partyB == undefined || getNew.amount == undefined || getNew.signDate == undefined || getNew.beginDate == undefined || getNew.endDate == undefined) {
		// console.log("><");
		res.send({
			error: "fail update"
		});
	} else {
		// console.log("<>");
		contractshistory.findVersionId(req.params['id'], function(versionId) {
			contractshistory.findBusiness(versionId, function(data) {
				var get;
				// console.log(data);
				if (data == undefined) {
					get = {
						contractId: getId._id,
						contractName: getNew.name,
						time: occur,
						getNew: 0,
						data: getNew
					};
				} else {
					get = {
						contractId: getId._id,
						contractName: getNew.name,
						time: occur,
						getNew: data[0].getNew + 1,
						data: getNew
					};
				}
				// console.log(get);
				contractshistory.insertBusiness(get, function() {
					console.log("update Version...");
					contract.updateIdData(getId, getNew, function(data) {

						console.log("starting....");
						var contract = new Contract();
						contract.upload(getNew.file, req.params['id'], function(data1) {
							contract.updateState(getId._id, function(result) {
								console.log("updateState");
								res.send(result);
							});
						});
					});
				});
			});
		});
	}
};

exports.destroy = function(req, res) {
	var occur = new Date();
	// console.log(occur);
	var contract = new Contract();
	var operationlog = new Operationlog();
	console.log("destroy");
	var getId = {
		_id: req.params['id']
	};
	contract.checkIdData(getId, function(info) {
		var logData = {
			url: req._parsedUrl.path, //完整的URL
			user: req.user.username, //用户名
			time: req._startTime, //时间
			operation: req.route.method, //操作类型
			data: info[0], //操作数据
			resource: req.route.path //资源路径
		};
		operationlog.insertRecord(logData, function(result) {
			// console.log(result);
			contract.removeData(getId, function(data) {
				res.send(data);
			});
		});
	});
};

exports.test = function(req, res) {
	console.log("test");
	var contract = new Contract();
	var contractshistory = new Contractshistory();
	var saveData = {
		"amount": 350000,
		"beginDate": "2013-08-01",
		"endDate": "2012-08-20",
		"myId": "C-KFGZ200908280008-KP ",
		"name": "IT人员外包合同（杭州远传）            ",
		"partyA": "恒拓开源（天津）信息科技有限公司广州分公司",
		"partyADept": "工程二部",
		"partyAabbr": "恒拓开源",
		"partyB": "南方航空公司",
		"partyBDept": "一部",
		"partyBabbr": "南航",
		"signDate": "2011-10-13",
		"state": "尾款",
		"events": [{
			"id": "C5CB601011200002614915201D901B97",
			"title": "首款到账",
			"date": "2011-11-03",
			"price": 45000,
			"completed": false,
			"invoiceDate": "2011-11-03",
			"priceDate": "2012-01-31",
			"invoiceDone": false
		}, {
			"id": "C5CB601000500332D9A4BE5F1BCE1208",
			"title": "尾款到账",
			"date": "2012-11-21",
			"price": 305000,
			"completed": false,
			"invoiceDate": "2012-11-21",
			"priceDate": "2013-03-04",
			"invoiceDone": false
		}]
	};

	if (saveData.myId == undefined || saveData.name == undefined || saveData.partyA == undefined || saveData.partyB == undefined || saveData.amount == undefined || saveData.signDate == undefined || saveData.beginDate == undefined || saveData.endDate == undefined) {
		res.send({
			error: "fail insert"
		});
	} else {
		contract.insertData(saveData, function(identify) {
			console.log("starting....");
			// console.log(identify);
			var contract = new Contract();
			contract.upload(saveData.file, identify[0]._id, function(data) {
				// console.log(data);
				var occur = new Date();
				var get = {
					contractName: saveData.name,
					contractId: identify[0]._id, //合同id
					time: occur, //时间
					getNew: 0, //版本
					data: saveData
				};
				contractshistory.insertBusiness(get, function(data) {
					// console.log(data);
					res.send({
						hello: "success insert"
					});
				});
			});
		});
	}
};

exports.exportExcel = function(req, res) {

	console.log("req.params.id:" + req.params.id);
	var queryId = req.params['id'] + '';
	var contract = new Contract();
	var conf = {};
	conf.cols = [{
		caption: '采购编号',
		type: 'string'
	}, {
		caption: '合同名称',
		type: 'string'
	}, {
		caption: '甲方',
		type: 'string'
	}, {
		caption: '甲方部门',
		type: 'string'
	}, {
		caption: '乙方',
		type: 'string'
	}, {
		caption: '乙方部门',
		type: 'string'
	}, {
		caption: '签订日期',
		type: 'date'
	}, {
		caption: '中标日期',
		type: 'date'
	}, {
		caption: '结束日期',
		type: 'date'
	}, {
		caption: '销售负责人',
		type: 'string'
	}, {
		caption: '商务负责人',
		type: 'string'
	}, {
		caption: '合同录入人',
		type: 'string'
	}, {
		caption: '合同性质',
		type: 'string'
	}, {
		caption: '业绩归属部门',
		type: 'string'
	}, {
		caption: '金额',
		type: 'number'
	}, {
		caption: '状态',
		type: 'string'
	}];

	var getId = {
		_id: queryId
	};
	contract.checkIdData(getId, function(data) {
		var m_data = [];
		var s = data[0].amount + "";
		var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
		var arry = [data[0].myId, data[0].name, data[0].partyA, data[0].partyADept, data[0].partyB, data[0].partyBDept, data[0].signDate, data[0].beginDate, data[0].endDate, data[0].sals_person, data[0].business_person, data[0].contract_person, data[0].contract_character, data[0].contract_dept, showAmount, data[0].state];
		m_data[0] = arry;
		conf.rows = m_data;
		var result = nodeExcel.execute(conf);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		var filename = encodeURIComponent(data[0].name);
		res.setHeader("Content-Disposition", "attachment; filename=" + filename + ".xlsx; filename *= utf-8" + filename + ".xlsx");
		res.end(result, 'binary');
	});
};

exports.testExcel = function(req, res) {

	var occur = new Date();
	var data = req.params['keywords'] + '';
	data = JSON.parse(data);
	var queryId = data.searchData;
	var pageData = data.pageData;
	var index = pageData.index;
	var item = pageData.item;
	var sortType = pageData.sortType;
	var order = pageData.order;
	var rule = [];
	if (req.session.rule == undefined || req.session.rule == null) {
		//console.log('hello');
		rule = [{}];
	} else {
		rule = req.session.rule;
	}
	var contract = new Contract();
	var conf = {};
	conf.cols = [{
		caption: '采购编号',
		type: 'string'
	}, {
		caption: '合同名称',
		type: 'string'
	}, {
		caption: '甲方',
		type: 'string'
	}, {
		caption: '乙方',
		type: 'string'
	}, {
		caption: '中标日期',
		type: 'date'
	}, {
		caption: '金额',
		type: 'number'
	}, {
		caption: '回款比率',
		type: 'string'
	}, {
		caption: '状态',
		type: 'string'
	}];

	if (queryId.searchType === "simple") {
		// console.log("simple");
		contract.simpleSearch(rule, queryId, function(data) {
			contract.pagination(data, index, data.length, sortType, order, function(returnData) {

				var contract_data = [];
				var newData = returnData.data;
				// console.log("newData.length = " + newData.length);
				for (var i = 0; i < newData.length; i++) {
					var events = newData[i].events;
					util.changeTwoDecimal(newData[i].returnRatio, function(ratio) {
						ratio = ratio * 100 + "%";
						var s = newData[i].amount + "";
						var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
						contract_data[i] = [newData[i].myId, newData[i].name, newData[i].partyA, newData[i].partyB, newData[i].beginDate, showAmount, ratio, newData[i].state];
					});
				}
				// console.log(contract_data);
				conf.rows = contract_data;
				var result = nodeExcel.execute(conf);
				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=contracts.xlsx");
				res.end(result, 'binary');
			});
		});
	} else if (queryId.searchType === "complex") {
		// console.log("fuzzySearch");
		contract.fuzzySearch(rule, queryId, function(data) {

			contract.pagination(data, index, data.length, sortType, order, function(returnData) {
				var contract_data = [];
				var newData = returnData.data;
				console.log("newData.length = " + newData.length);
				for (var i = 0; i < newData.length; i++) {
					var events = newData[i].events;

					util.changeTwoDecimal(newData[i].returnRatio, function(ratio) {
						ratio = ratio * 100 + "%";
						var s = newData[i].amount + "";
						var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
						contract_data[i] = [newData[i].myId, newData[i].name, newData[i].partyA, newData[i].partyB, newData[i].beginDate, showAmount, ratio, newData[i].state];

					});
				}
				// console.log(contract_data);
				conf.rows = contract_data;
				var result = nodeExcel.execute(conf);

				res.setHeader('Content-Type', 'application/vnd.openxmlformats');
				res.setHeader("Content-Disposition", "attachment; filename=contracts.xlsx");
				res.end(result, 'binary');
			});
		});
	}
};

exports.exportContracts = function(req, res) {
	var contract = new Contract();
	var conf = {};
	conf.cols = [{
		caption: '采购编号',
		type: 'string'
	}, {
		caption: '合同名称',
		type: 'string'
	}, {
		caption: '甲方',
		type: 'string'
	}, {
		caption: '乙方',
		type: 'string'
	}, {
		caption: '中标日期',
		type: 'date'
	}, {
		caption: '金额',
		type: 'number'
	}, {
		caption: '状态',
		type: 'string'
	}];
	contract.checkInfo(function(data) {
		var contract_data = [];
		for (var i = 0; i < data.length; i++) {
			var s = data[i].amount + "";
			var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
			contract_data[i] = [data[i].myId, data[i].name, data[i].partyA, data[i].partyB, data[i].beginDate, showAmount, data[i].state];

		}
		conf.rows = contract_data;
		var result = nodeExcel.execute(conf);

		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		res.setHeader("Content-Disposition", "attachment; filename=contracts.xlsx");
		res.end(result, 'binary');
	});
};

exports.pieExcel = function(req, res) {
	var getData = req.params['postJson'];
	var jsonData = JSON.parse(getData);
	var id = jsonData.id;
	var partyType = jsonData.partyType;
	var startDate = jsonData.startDate;
	var endDate = jsonData.endDate;
	var contract = new Contract();
	var transId = {
		_id: id
	};

	var conf = {};
	conf.cols = [{
		caption: '合同名称',
		type: 'string'
	}, {
		caption: '甲方',
		type: 'string'
	}, {
		caption: '乙方',
		type: 'string'
	}, {
		caption: '合同金额',
		type: 'number'
	}, {
		caption: '状态',
		type: 'string'
	}];

	var pdata = {
		_id: id,
		startDate: startDate,
		endDate: endDate,
		partyType: partyType
	};
	if (req.session.rule == undefined || req.session.rule == null) {
		//console.log('hello');
		rule = [{}];
	} else {
		rule = req.session.rule;
	}
	var rules = {
		$or: rule
	};

	contract.getPieData(pdata, rules, function(data) {
		if (data.rData != null) {
			for (var i = 0; i < data.rData.length; i++) {
				var s = data.rData[i][3] + "";
				var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
				data.rData[i][3] = showAmount;
			}
		}
		conf.rows = data.rData;

		var result = nodeExcel.execute(conf);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats');
		var filename = encodeURIComponent(data.name);
		res.setHeader('Content-Disposition', "attachment; filename=" + filename + ".xlsx;filename *= gbk" + filename + ".xlsx");
		res.end(result, 'binary');
	});
};

exports.statistical = function(req, res) {

	console.log("statistical");
	var contract = new Contract();
	var rule = req.session.desktopRule;
	var rules = {
		$or: rule
	};
	var year = req.params['year'];
	contract.countInfoOneYear(year, rules, function(data) {
		res.send(data);
	});
};

exports.monthDetail = function(req, res) {

	// console.log("monthDetail");
	var contract = new Contract();
	var rule = req.session.desktopRule;
	var rules = {
		$or: rule
	};
	var year = req.params['year'];
	var month = req.params['month'];
	var type = req.params['type'];
	contract.countMonthEvents(year, month, rules, function(data) {
		if (type == 1) {
			res.send(data.events);
		}
		if (type == 2) {
			res.send(data.returnEvents);
		}
	});
};

exports.saveAll = function(req, res) {
	var contract = new Contract();
	contract.queryContracts(function(data) {

		for (var k = 0; k < data.length; k++) {
			var item = data[k];
			item.business_person = "wangyanxi";
			item.contract_dept = "广州分公司";
			var events = item.events;
			for (var i = 0; i < events.length; i++) {
				if (events[i].price == -1) {
					events[i].customEve_person = "qiudanni";
				} else {
					events[i].priceEve_person1 = "liujialing";
					events[i].priceEve_person2 = "liujialing";
				}
			}
			var idJson = {
				_id: item._id
			};
			var updateData = {
				business_person: item.business_person,
				contract_dept: item.contract_dept,
				events: item.events
			};
			contract.updateIdData(idJson, updateData, function(docs) {
				console.log(docs);
			});
		}
		res.send("success");
	});
};