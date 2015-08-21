/***
 *  任务测试接口
 *
 *
 ****/

var async = require('async'),
	mongoose = require('mongoose'),
	Contract = mongoose.model('Contract'),
	Contractshistory = mongoose.model('Contractshistory'),
	Template = mongoose.model('Template'),
	UserRole = mongoose.model('UserRole'),
	nodeExcel = require('excel-export');
var util = require('./util');

exports.index = function(req, res) { //返回所有待办任务

	var template = new Template();
	var contract = new Contract();
	var userRole = new UserRole();
	var roles = req.session.roles;
	var name = req.user.username;
	var uid = req.user.uid;
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
	if (req.user == undefined) {
		res.redirect('/login');
	} else {
		userRole.findOne(uid, function(data) { //根据用户uid查询出他对应的角色
			roles = data[0].role; //取出角色
			contract.checkAllUndoneEvents(rules, roles, name, function(data) {
				console.info("checkAllUndoneEvents");
				res.send(data);
			});
		});
	}
};

exports.done = function(req, res) {
	var template = new Template();
	var contract = new Contract();
	var roles = req.session.roles;
	var name = req.user.username;
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
	contract.checkLastWeekDone(rules, roles, name, function(data) {
		console.log("checkLastWeekDone");
		res.send(data);
	});
};

exports.showOne = function(req, res) {
	var contract = new Contract();
	var id = req.params['id'];
	contract.checkUndoneEvents(id, function(data) {
		console.info("checkUndoneEvents");
		res.send(data);
	});
};

exports.show = function(req, res) { //返回指定合同业务数据
	var template = new Template();
	var contract = new Contract();
	var id = req.params['id'];
	console.log(id);
	contract.countOneGetMoney(id, function(data) {
		console.log("countOneGetMoney");
		res.send(data);
	});
};

exports.testReturn = function(req, res) { //测试分页返回指定合同业务数据

	var template = new Template();
	var contract = new Contract();
	var getData = req.params['postData'];
	console.log(getData);
	var obj = JSON.parse(getData);
	var index = obj.index; //拿到第几页
	var item = obj.item; //拿到每页多少条
	var begin = item * (index - 1); //
	var end = item * index - 1;
	var sortType = obj.sortType;
	var order = obj.order;
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
	contract.countAllGotMoney(rules, function(data) {
		var returnResult = data.allReturnRecord;
		for (var i = 0; i < returnResult.length; i++) {
			if (returnResult[i].returnRecord != []) {
				for (var j = 0; j < returnResult[i].returnRecord.length; j++) {
					returnResult[i].returnRecord[j].returnRatio = returnResult[i].returnRatio;
				}
			}
		}

		var buildResult = [];
		var r = 0;
		for (var m = 0; m < returnResult.length; m++) {
			if (returnResult[m].returnRecord != []) {
				for (var n = 0; n < returnResult[m].returnRecord.length; n++) {
					buildResult[r] = returnResult[m].returnRecord[n];
					r++;
				}
			}
		}

		//对数据先进行排序
		if ("desc" === order) {
			buildResult.sort(function(a, b) {
				return a[sortType] >= b[sortType] ? -1 : 1;
			});
		} else {
			buildResult.sort(function(a, b) {
				return a[sortType] > b[sortType] ? 1 : -1;
			});
		}

		//因为已回款有搜索功能，执行搜索后的数据为上面基础上过滤的后的数据
		var beginDate = obj.bDate;
		var endDate = obj.eDate;
		var sortResult = [];
		var isSortMode = (beginDate != 0); //搜索模式

		//如果是搜索模式，则过滤出时间段内的数据
		if (isSortMode) {
			var t = 0;
			for (var i = 0; i < buildResult.length; i++) {
				if (buildResult[i].date >= beginDate && buildResult[i].date <= endDate) {
					sortResult[t] = buildResult[i];
					t++;
				}
			}
		}

		var sendReturn = [];
		var p = 0;

		for (var q = begin; q < end + 1; q++) {
			if (isSortMode) {
				if (q < sortResult.length) {
					sendReturn[p] = sortResult[q];
					p++;
				}
			} else if (q < buildResult.length) {
				sendReturn[p] = buildResult[q];
				p++;
			}
		}

		var getReturn = isSortMode ? {
			count: sortResult.length,
			data: sendReturn
		} : {
			count: buildResult.length,
			data: sendReturn
		};
		res.send(getReturn);
	});
};
exports.testWait = function(req, res) { //测试分页返回指定合同业务数据

	var template = new Template();
	var contract = new Contract();

	var getData = req.params['postData'];
	console.log(getData);
	var obj = JSON.parse(getData);

	var index = obj.index; //拿到第几页
	var item = obj.item; //拿到每页多少条
	var begin = item * (index - 1); //
	var end = item * index - 1;
	var sortType = obj.sortType;
	var order = obj.order;
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
	contract.countAllGotMoney(rules, function(data) {
		var returnResult = data.allWaitRecord;
		for (var i = 0; i < returnResult.length; i++) {
			if (returnResult[i].waitRecord != []) {
				for (var j = 0; j < returnResult[i].waitRecord.length; j++) {
					returnResult[i].waitRecord[j].returnRatio = returnResult[i].returnRatio;
				}
			}
		}
		var buildResult = [];
		var r = 0;
		for (var m = 0; m < returnResult.length; m++) {
			if (returnResult[m].waitRecord != []) {
				for (var n = 0; n < returnResult[m].waitRecord.length; n++) {
					buildResult[r] = returnResult[m].waitRecord[n];
					r++;
				}
			}
		}

		//对数据先进行排序
		if ("desc" === order) {
			buildResult.sort(function(a, b) {
				return a[sortType] >= b[sortType] ? -1 : 1;
			});
		} else {
			buildResult.sort(function(a, b) {
				return a[sortType] > b[sortType] ? 1 : -1;
			});
		}

		///抽取符合时间范围内的款项
		var beginDate = obj.bDate;
		var endDate = obj.eDate;
		var searchResult = [];

		var isSearchMode = (beginDate != 0); //搜索模式

		//如果是搜索模式，则过滤出时间段内的数据
		if (isSearchMode) {
			var t = 0;
			for (var i = 0; i < buildResult.length; i++) {
				if (buildResult[i].priceDate >= beginDate && buildResult[i].priceDate <= endDate) {
					searchResult[t] = buildResult[i];
					t++;
				}
			}
		}
		///
		var sendWait = [];
		var p = 0;
		var count = 0;
		for (var q = begin; q < end + 1; q++) {
			if (isSearchMode) {
				count = searchResult.length;
				if (q < searchResult.length) {
					sendWait[p] = searchResult[q];
					p++;
				}
			} else {
				count = buildResult.length;
				if (q < buildResult.length) {
					sendWait[p] = buildResult[q];
					p++;
				}
			}
		}

		var getWait = {
			count: count,
			data: sendWait
		};
		console.log("原始待回款");
		console.log(buildResult);
		console.log(getWait);
		res.send(getWait);
	});
};
exports.testUnreturn = function(req, res) { //测试分页返回指定合同业务数据

	var template = new Template();
	var contract = new Contract();
	var getData = req.params['postData'];
	var obj = JSON.parse(getData);
	var index = obj.index; //拿到第几页
	var item = obj.item; //拿到每页多少条
	var begin = item * (index - 1); //
	var end = item * index - 1;
	var sortType = obj.sortType;
	var order = obj.order;
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
	contract.countAllGotMoney(rules, function(data) {
		var returnResult = data.allUnreturnRecord;
		for (var i = 0; i < returnResult.length; i++) {
			if (returnResult[i].unreturnRecord != []) {
				for (var j = 0; j < returnResult[i].unreturnRecord.length; j++) {
					returnResult[i].unreturnRecord[j].returnRatio = returnResult[i].returnRatio;
				}
			}
		}

		var buildResult = [];
		var r = 0;
		for (var m = 0; m < returnResult.length; m++) {
			if (returnResult[m].unreturnRecord != []) {
				for (var n = 0; n < returnResult[m].unreturnRecord.length; n++) {
					buildResult[r] = returnResult[m].unreturnRecord[n];
					r++;
				}
			}
		}

		//对数据先进行排序
		if ("desc" === order) {
			buildResult.sort(function(a, b) {
				return a[sortType] >= b[sortType] ? -1 : 1;
			});
		} else {
			buildResult.sort(function(a, b) {
				return a[sortType] > b[sortType] ? 1 : -1;
			});
		}

		///抽取符合时间范围内的款项
		var beginDate = obj.bDate;
		var endDate = obj.eDate;
		var searchResult = [];
		var isSearchMode = (beginDate != 0); //搜索模式

		//如果是搜索模式，则过滤出时间段内的数据
		if (isSearchMode) {
			var t = 0;
			var allmount = 0;
			for (var i = 0; i < buildResult.length; i++) {
				if (buildResult[i].priceDate >= beginDate && buildResult[i].priceDate <= endDate) {
					searchResult[t] = buildResult[i];
					t++;
					allmount += buildResult[i].unreturnAmount;
				}
			}
		}

		var sendUnreturn = [];
		var count;
		var p = 0;
		for (var q = begin; q < end + 1; q++) {
			if (isSearchMode) {
				count = searchResult.length;
				if (q < searchResult.length) {
					sendUnreturn[p] = searchResult[q];
					p++;
				}
			} else {
				count = buildResult.length;
				if (q < buildResult.length) {
					sendUnreturn[p] = buildResult[q];
					p++;
				}
			}
		}

		var getUnreturn = {
			count: count,
			data: sendUnreturn
		};
		res.send(getUnreturn);
	});
};

exports.update = function(req, res) { //修改待办任务完成标志位

	var contract = new Contract();
	var contractshistory = new Contractshistory();
	console.log("update");
	var occur = new Date();
	var year = occur.getFullYear();
	var month = occur.getMonth() + 1;
	var day = occur.getDate(); ///
	day = day < 10 ? "0" + day : day;
	month = month < 10 ? "0" + month : month;
	var getOccur = year + "-" + month + "-" + day;
	var get = req.body;
	if (get.newDate == "" || get.newDate == undefined) {
		get.newDate = getOccur;
	}
	var id = get._id; //合同id
	var eventId = get.id;
	var eventName = get.title;
	var newDate = get.newDate;
	var checkValue;
	if ('true' == get.completed)
		checkValue = true;
	if ('false' == get.completed)
		checkValue = false;
	var remark = get.remark;
	contractshistory.findVersionId(id, function(versionId) {
		// console.log(versionId);
		contract.updateSymbol(id, eventId, checkValue, remark, eventName, newDate, function(newData) {

			contractshistory.findBusiness(versionId, function(data) {
				var got;
				console.log(data);
				if (data == undefined) {
					got = {
						contractId: get._id,
						contractName: get.name,
						time: occur,
						getNew: 0,
						data: newData[0] == undefined ? null : newData[0]
					};
				} else {
					got = {
						contractId: get._id,
						contractName: get.name,
						time: occur,
						getNew: data[0].getNew + 1,
						data: newData[0] == undefined ? null : newData[0]
					};
				}
				contractshistory.insertBusiness(got, function() {
					console.log("update Version...");
					res.send(newData);
				});
			});
		});
	});
};

exports.count = function(req, res) { //返回指定合同业务数据

	var template = new Template();
	var contract = new Contract();
	var getTime = "2013-07-18";
	contract.countWillGetMoney(getTime, function(data) {
		console.log("countWillGetMoney");
		res.send(data);
	});
};

exports.finish = function(req, res) { //返回指定合同业务数据

	var template = new Template();
	var contract = new Contract();
	contract.checkAlldoneContracts(function(data) {
		console.log("checkAlldoneContracts");
		console.log(data);
		res.send("data:" + data);
	});
};

exports.graphics = function(req, res) {

	console.log("graphics");
	var rule = req.session.desktopRule;
	var rules = {
		$or: rule
	};
	console.log("rules::::::::::::", rules);
	var contract = new Contract();
	var beginDate = req.params['startDate'] + '';
	var endDate = req.params['endDate'] + '';

	contract.countGraphics(beginDate, endDate, rules, function(data) {
		res.send(data);
	});
};

//导出应收款表格
exports.funShouldExport = function(req, res) {
	console.log("========funShouldExport");
	var keywords = req.params['keywords'] + '';
	var jsonData = JSON.parse(keywords);
	var beginDate = jsonData.startDate;
	var endDate = jsonData.endDate;
	var contract = new Contract();
	if (req.user == undefined) {
		res.redirect('/login');
	} else {
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
			type: 'string'
		}, {
			caption: '回款金额',
			type: 'string'
		}, {
			caption: '回款比率',
			type: 'string'
		}, {
			caption: '预计完成时间',
			type: 'string'
		}, {
			caption: '备注',
			type: 'string'
		}];
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
		contract.countAllGotMoney(rules, function(data) {
			var returnResult = data.allUnreturnRecord;
			for (var i = 0; i < returnResult.length; i++) {
				if (returnResult[i].unreturnRecord != []) {
					for (var j = 0; j < returnResult[i].unreturnRecord.length; j++) {
						returnResult[i].unreturnRecord[j].returnRatio = returnResult[i].returnRatio;
					}
				}
			}

			var buildResult = [];
			var r = 0;
			var rowsData = [];
			var index = 0;
			for (var m = 0; m < returnResult.length; m++) {
				if (returnResult[m].unreturnRecord != []) {
					for (var n = 0; n < returnResult[m].unreturnRecord.length; n++) {
						buildResult[r] = returnResult[m].unreturnRecord[n];
						r++;
					}
				}
			}
			buildResult.sort(function(a, b) {
				return a.priceDate > b.priceDate ? 1 : -1
			});

			for (var i = 0; i < buildResult.length; i++) {
				util.changeTwoDecimal(buildResult[i].returnRatio, function(ratio) {
					ratio = ratio * 100 + "%"
					var s = buildResult[i].amount + "";
					var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
					if (buildResult[i].priceDate >= beginDate && buildResult[i].priceDate <= endDate) {
						rowsData[index] = [buildResult[i].contractName, buildResult[i].partyAabbr, buildResult[i].partyBabbr, showAmount, buildResult[i].unreturnAmount, ratio, buildResult[i].priceDate, buildResult[i].state];
						index++;
					}
				});
			}

			conf.rows = rowsData;
			var result = nodeExcel.execute(conf);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			res.setHeader("Content-Disposition", "attachment; filename=" + "funShould.xlsx");
			res.end(result, 'binary');
		});
	}
};

exports.funWaitExport = function(req, res) {
	console.log("========funWaitExport");
	var keywords = req.params['keywords'] + '';
	var jsonData = JSON.parse(keywords);
	var beginDate = jsonData.startDate;
	var endDate = jsonData.endDate;
	var contract = new Contract();
	if (req.user == undefined) {
		res.redirect('/login');
	} else {
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
			type: 'string'
		}, {
			caption: '回款金额',
			type: 'string'
		}, {
			caption: '回款比率',
			type: 'string'
		}, {
			caption: '预计完成时间',
			type: 'string'
		}, {
			caption: '申请时间',
			type: 'string'
		}, {
			caption: '备注',
			type: 'string'
		}];
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
		contract.countAllGotMoney(rules, function(data) {
			var returnResult = data.allWaitRecord;
			for (var i = 0; i < returnResult.length; i++) {
				if (returnResult[i].waitRecord != []) {
					for (var j = 0; j < returnResult[i].waitRecord.length; j++) {
						returnResult[i].waitRecord[j].returnRatio = returnResult[i].returnRatio;
					}
				}
			}
			var buildResult = [];
			var r = 0;
			for (var m = 0; m < returnResult.length; m++) {
				if (returnResult[m].waitRecord != []) {
					for (var n = 0; n < returnResult[m].waitRecord.length; n++) {
						buildResult[r] = returnResult[m].waitRecord[n];
						r++;
					}
				}
			}

			///待回款记录排序
			buildResult.sort(function(a, b) {
				return a.priceDate > b.priceDate ? 1 : -1
			});

			var isSearchMode = (beginDate != 0); //搜索模式

			//如果是搜索模式，则过滤出时间段内的数据
			if (isSearchMode) {
				var searchResult = [];
				var t = 0;
				for (var i = 0; i < buildResult.length; i++) {
					if (buildResult[i].priceDate >= beginDate && buildResult[i].priceDate <= endDate) {
						searchResult[t] = buildResult[i];
						t++;
					}
				}
				buildResult = searchResult;
			}

			var rowsData = [];
			var index = 0;
			for (var i = 0; i < buildResult.length; i++) {
				util.changeTwoDecimal(buildResult[i].returnRatio, function(ratio) {
					ratio = ratio * 100 + "%";
					var s = buildResult[i].amount + "";
					var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
					rowsData[index] = [buildResult[i].contractName, buildResult[i].partyAabbr, buildResult[i].partyBabbr, showAmount, buildResult[i].waitAmount, ratio, buildResult[i].priceDate, buildResult[i].date, buildResult[i].state];
					index++;
				});

			}
			conf.rows = rowsData;
			var result = nodeExcel.execute(conf);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			res.setHeader("Content-Disposition", "attachment; filename=" + "funWait.xlsx");
			res.end(result, 'binary');
		});
	}
};

exports.funExport = function(req, res) {

	var contract = new Contract();
	if (req.user == undefined) {
		res.redirect('/login');
	} else {
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
			type: 'string'
		}, {
			caption: '回款金额',
			type: 'string'
		}, {
			caption: '回款比率',
			type: 'string'
		}, {
			caption: '回款日期',
			type: 'string'
		}, {
			caption: '备注',
			type: 'string'
		}];
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
		contract.countAllGotMoney(rules, function(data) {
			var returnResult = data.allReturnRecord;
			console.log("=======returnResult========");
			console.log(returnResult);
			for (var i = 0; i < returnResult.length; i++) {
				if (returnResult[i].returnRecord != []) {
					for (var j = 0; j < returnResult[i].returnRecord.length; j++) {
						returnResult[i].returnRecord[j].returnRatio = returnResult[i].returnRatio;
					}
				}
			}

			var rowsData = [];
			var index = 0;

			//因为已回款有搜索功能，执行搜索后的数据为上面基础上过滤的后的数据
			var keywords = req.params['keywords'] + '';
			var jsonData = JSON.parse(keywords);
			var beginDate = jsonData.startDate;
			var endDate = jsonData.endDate;
			var sortResult = [];
			var isSortMode = (beginDate != 0); //搜索模式

			for (var m = 0; m < returnResult.length; m++) {
				if (returnResult[m].returnRecord != []) {
					for (var n = 0; n < returnResult[m].returnRecord.length; n++) {
						var buildResult = returnResult[m].returnRecord[n];
						//如果是搜索模式，则过滤出时间段内的数据
						util.changeTwoDecimal(buildResult.returnRatio, function(ratio) {
							ratio = ratio * 100 + "%";
							var s = buildResult.amount + "";
							var showAmount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
							if (isSortMode) {
								if (buildResult.date >= beginDate && buildResult.date <= endDate) {
									rowsData[index] = [buildResult.contractName, buildResult.partyAabbr, buildResult.partyBabbr, showAmount, buildResult.returnAmount, ratio, buildResult.date, buildResult.state];
									index++;
								}
							} else {
								rowsData[index] = [buildResult.contractName, buildResult.partyAabbr, buildResult.partyBabbr, showAmount, buildResult.returnAmount, ratio, buildResult.date, buildResult.state];
								index++;
							}
						});
					}
				}
			}

			conf.rows = rowsData;
			var result = nodeExcel.execute(conf);
			res.setHeader('Content-Type', 'application/vnd.openxmlformats');
			res.setHeader("Content-Disposition", "attachment; filename=" + "fun.xlsx");
			res.end(result, 'binary');

		});
	}
};

//找出合同中重复的事件并标记为未完成
exports.getEvents = function(req, res) {
	var contract = new Contract();
	contract.queryContracts(function(data) {
		var doubleEvents = [];
		for (var i = 0; i < data.length; i++) {
			// console.log("returnRatio = " + data[i].returnRatio);
			var conEvents = data[i].events;
			if (data[i].returnRatio > 1) {

				var eventList = [];
				for (var j = 0; j < conEvents.length; j++) {
					// console.log("events.id = " + conEvents[j].id);
					eventList.push(conEvents[j]);
					for (var k = 0; k < eventList.length; k++) {
						if (eventList[k].id == conEvents[j].id && eventList[k]._id != conEvents[j]._id) {
							conEvents[j].completed = false;
							eventList[k].completed = false;
							var doubleData = {
								eventData: conEvents[j],
								conName: data[i].name
							}
							doubleEvents.push(doubleData);
						}
					}
				}
			} else {
				var eventAmount = 0;
				for (var m = 0; m < conEvents.length; m++) {
					if (conEvents[m].price > 0) {
						eventAmount += conEvents[m].price;
					}
				}
				if (eventAmount > data[i].amount) {
					var eventList = [];
					for (var j = 0; j < conEvents.length; j++) {
						// console.log("events.id = " + conEvents[j].id);
						eventList.push(conEvents[j]);
						for (var k = 0; k < eventList.length; k++) {
							if (eventList[k].id == conEvents[j].id && eventList[k]._id != conEvents[j]._id) {
								conEvents[j].completed = false;
								eventList[k].completed = false;
								var doubleData = {
									eventData: conEvents[j],
									conName: data[i].name
								}
								doubleEvents.push(doubleData);
							}
						}
					}
				}
			}
			var getId = {
				_id: data[i]._id
			};

			var getNew = {
				uid: req.user.uid, //用户id,对应用户模型的uid
				myId: data[i].myId, //合同编号
				partyA: data[i].partyA, //签署甲方
				partyAabbr: data[i].partyAabbr, //甲方简称
				partyADept: data[i].partyADept, //甲方部门
				partyB: data[i].partyB, //签署乙方
				partyBabbr: data[i].partyBabbr, //乙方简称
				partyBDept: data[i].partyBDept, //乙方部门
				amount: data[i].amount, //金额
				returnRatio: data[i].returnRatio, //回款比率
				returnAmount: data[i].returnAmount, //回款金额
				// lastReturnDate: data[i].lastReturnDate, //上次回款日期
				signDate: data[i].signDate, //签署日期
				name: data[i].name, //合同名称
				// tName: data[i].tName, //合同模版名称
				beginDate: data[i].beginDate, //开始日期
				endDate: data[i].endDate, //结束日期
				events: conEvents, //合同事件
				purchases: data[i].purchases, //采购事件
				state: data[i].state, //合同状态
				// next: data[i].next, //待办任务
				contract_person: data[i].contract_person, //合同录入人
				sals_person: data[i].sals_person, //销售负责人
				business_person: data[i].business_person, //商务负责人
				contract_dept: data[i].contract_dept //合同业绩归属部门
			};
			// data[i].events = conEvents;
			console.log(getNew);
			contract.updateIdData(getId, getNew, function(data) {
				console.log(data);
			});
		}
		console.log("doubleEvents.length = " + doubleEvents.length);
		res.send(doubleEvents);
	});
};