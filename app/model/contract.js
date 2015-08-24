/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	Repository = require('./repository');

//事件子模型
var EventsSchema = new Schema({ //假如非回款事件,price,invoiceDate,invoiceDone字段默认为-1
	id: String, //事件id
	title: String, //事件名称
	remark: String, //事件备注
	price: Number, //回款金额
	date: String, //执行日期
	completed: Boolean, //事件完成标志
	priceDate: String, //回款日期
	invoiceDate: String, //发票日期
	invoiceDone: Boolean, //是否开发票标志
	customEve_person: String, //自定义事件经办人
	priceEve_person1: String, //回款事件经办人(发票)
	priceEve_person2: String //回款事件经办人(事件)
});
//采购子模型
var PurchaseSchema = mongoose.Schema({
	pid: String, //采购id
	content: String, //采购内容
	price: String, //采购单价
	count: String, //采购数量
});
//合同模型
var ContractSchema = mongoose.Schema({ //创建合同模型对象
	uid: String, //用户id,对应用户模型的uid
	myId: String, //合同编号
	partyA: String, //签署甲方
	partyAabbr: String, //甲方简称
	partyADept: String, //甲方部门
	partyB: String, //签署乙方
	partyBabbr: String, //乙方简称
	partyBDept: String, //乙方部门
	amount: Number, //金额
	returnRatio: Number, //回款比率
	returnAmount: Number, //回款金额
	lastReturnDate: String, //上次回款日期
	signDate: String, //签署日期
	name: String, //合同名称
	tName: String, //合同模版名称
	beginDate: String, //开始日期
	endDate: String, //结束日期
	events: [EventsSchema], //合同事件
	purchases: [PurchaseSchema], //采购事件
	state: String, //合同状态
	next: String, //待办任务
	contract_person: String, //合同录入人
	sals_person: String, //销售负责人
	business_person: String, //商务负责人
	contract_dept: String, //合同业绩归属部门
	contract_character: String //合同性质
});

ContractSchema.methods = {
	//对数据进行分页
	pagination: function(data, pageIndex, item, sortType, order, callback) {
		//将每条合同数据的回款比例计算出整合到数据中
		for (index in data) {
			var jsonData = {
				_id: data[index]._id,
				_name: data[index]._name,
				amount: data[index].amount,
				beginDate: data[index].beginDate,
				business_person: data[index].business_person,
				contract_dept: data[index].contract_dept,
				endDate: data[index].endDate,
				events: data[index].events,
				myId: data[index].myId,
				name: data[index].name,
				partyA: data[index].partyA,
				partyADept: data[index].partyADept,
				partyAabbr: data[index].partyAabbr,
				partyB: data[index].partyB,
				partyBDept: data[index].partyBDept,
				partyBabbr: data[index].partyBabbr,
				sals_person: data[index].sals_person,
				signDate: data[index].signDate,
				state: data[index].state,
				returnRatio: data[index].returnRatio
			};
			data[index] = jsonData;
		}
		//排序
		if ("desc" === order) {
			data.sort(function(a, b) {
				return a[sortType] >= b[sortType] ? -1 : 1;
			});
		}
		if ("asc" === order) {
			data.sort(function(a, b) {
				return a[sortType] > b[sortType] ? 1 : -1;
			});
		}
		/*  按分页参数返回所需数据*/
		var dataLen = data.length;
		var lastPage = Math.ceil(dataLen / item);
		var returnData = [];
		if (pageIndex == 1 & dataLen <= item) {
			returnData = data.slice(0); //将数组拷贝给returnData
		} else if (pageIndex != 1 & pageIndex == lastPage) {
			returnData = data.slice((pageIndex - 1) * item);
		} else {
			returnData = data.slice((pageIndex - 1) * item, pageIndex * item);
		}
		returnData = {
			"data": returnData,
			"count": dataLen
		};
		callback(returnData);
	},

	//---------------testData---------
	all: function(rule, callback) {
		this.model('Contract').find(rule, function(err, data) {
			callback(data);
		});
	},

	//查询所有合同信息
	queryContracts: function(callback) {
		// console.log("model------findAll");
		this.model('Contract').find({}, function(err, data) {
			callback(data);
		});
	},

	//---------------test end--------

	test: function() {
		console.info("=======test");
	},
	//展示所有合同重要信息
	checkInfo: function(callback) {

		this.model('Contract').find({}, {
			_id: 1,
			myId: 1,
			id: 1,
			name: 1,
			amount: 1,
			returnRatio: 1,
			returnAmount: 1,
			lastReturnDate: 1,
			signDate: 1,
			partyA: 1,
			partyAabbr: 1,
			partyADept: 1,
			partyB: 1,
			partyBabbr: 1,
			partyBDept: 1,
			beginDate: 1,
			endDate: 1,
			events: 1,
			purchases: 1,
			state: 1,
			next: 1,
			contract_person: 1,
			sals_person: 1,
			business_person: 1,
			contract_dept: 1,
			contract_character: 1
		}, function(err, docs) {
			callback(docs);
		});
	},

	//展示所有合同重要信息
	checkInfoData: function(rules, callback) {

		this.model('Contract').find(rules, {
			_id: 1,
			myId: 1,
			id: 1,
			name: 1,
			amount: 1,
			returnRatio: 1,
			returnAmount: 1,
			lastReturnDate: 1,
			signDate: 1,
			partyA: 1,
			partyAabbr: 1,
			partyADept: 1,
			partyB: 1,
			partyBabbr: 1,
			partyBDept: 1,
			beginDate: 1,
			endDate: 1,
			events: 1,
			purchases: 1,
			state: 1,
			next: 1,
			contract_person: 1,
			sals_person: 1,
			business_person: 1,
			contract_dept: 1,
			contract_character: 1
		}, function(err, docs) {
			callback(docs);
		});
	},

	//展示所有合同模版重要信息
	checkTemplateInfo: function(callback) {

		this.model('Template').find({}, {
			_id: 1,
			tName: 1
		}, function(err, docs) {
			callback(docs);
		});
	},

	//根据id展示指定合同详细信息
	/*
	 * id:合同<_id,id>
	 * callback:回调返回数据
	 */
	checkIdData: function(id, callback) {

		this.model('Contract').find(id, function(err, docs) {
			console.log("====show===");
			// console.log(docs);
			callback(docs);
		});
	},

	//根据id展示指定合同详细信息
	/*
	 * id:合同模版<_id,id>
	 * callback:回调返回数据
	 */
	checkIdTemplate: function(id, callback) {

		this.model('Template').find(id, function(err, docs) {
			console.log("====show===");
			// console.log(docs);
			callback(docs);
		});
	},

	/*
	 *id:合同模板id
	 *callback：回调返回函数
	 */
	checkOneBasic: function(id, callback) {

		this.model('Contract').find(id, function(err, docs) {
			// console.log(docs[0]);
			var id = "";
			var contractName = "";
			var count = "";
			var amount = "";
			var state = "";
			var data = {};
			if (docs == '') {
				data = {};
			} else {
				id = docs[0].myId;
				contractName = docs[0].name;
				if (docs[0].purchases == '') {
					// console.log("purchases in");
					count = "0";
				} else {
					count = docs[0].purchases[0].count;
				}
				// console.info(count);
				amount = docs[0].amount; //金额
				state = docs[0].state; //合同状态

				data = {
					"id": id,
					"name": contractName,
					"count": count,
					"amount": amount,
					"state": state
				};
			}
			callback(data);
		});
	},

	/**
	 *根据合同名返回所有的合同信息列表
	 *
	 *
	 */
	checkListBasic: function(name, callback) {
		this.model('Contract').find({
				"name": name
			},
			function(err, docs) {
				var data = [];
				// console.log("docs:");
				// console.log(docs);

				var id = "";
				var count = "";
				var contractName = "";
				var amount = "";
				var state = "";
				var docu = {};
				var purchases = []
				for (var i = 0; i < docs.length; i++) {
					id = docs[i].myId;
					// console.log("purchase:");
					if (docs[i].purchases == '') {
						count = "0";
					} else {
						count = docs[i].purchases[0].count;
					}
					// console.log("count:");
					// console.log(count);
					contractName = docs[i].name;
					amount = docs[i].amount; //金额
					state = docs[i].state; //合同状态
					doc = {
						"id": id,
						"name": contractName,
						"count": count,
						"amount": amount,
						"state": state
					};
					data[i] = doc;
				}
				callback(data);
			});
	},

	/**
	 *获取所有的合同信息列表
	 */
	checkDetailData: function(name, callback) {
		this.model('Contract').find({
			'name': name
		}, function(err, docs) {
			// console.log(docs);
			callback(docs);
		});
	},

	/**
	 *获取所有的合同信息列表(模糊查询)
	 */
	checkDetailDataByName: function(name, callback) {
		var mName = RegExp(name);
		this.model('Contract').find({
			'name': {
				"$all": [mName]
			}
		}, function(err, docs) {
			// console.log(docs);
			callback(docs);
		});
	},

	//应收款表格下载
	contractExcel: function(callback) {
		Contract = this.model('Contract');
		Contract.find({}, function(err, docs) {

			var funData = [];
			var index = 0;
			docs.forEach(function(doc) {
				var count = 0; //存储该合同已回款总额
				var allCount = 0; //存储该合同总金额
				var waitCount = 0; //待回款
				var returnRecord = []; //已回款记录
				var m = 0;
				var waitRecord = []; //待回款记录
				var n = 0;
				var unreturnRecord = []; //未回款记录
				var k = 0;
				var getData;
				var flag = 0;
				var lastDate = "无";
				var applicantDate = "无";
				var occur = new Date();
				var year = occur.getFullYear();
				var month = occur.getMonth() + 1;
				var day = occur.getDate(); ///
				day = day < 10 ? "0" + day : day;
				month = month < 10 ? "0" + month : month;
				var getOccur = year + "-" + month + "-" + day;
				for (var i = 0; i < doc.events.length; i++) { //遍历该合同的事件数组
					// allCount = allCount + doc.amount;
					if (doc.events[i].price > 0 && doc.events[i].completed == true) {
						count = count + doc.events[i].price;
						var re = {
							"name": doc.events[i].title,
							"amount": doc.events[i].price,
							"date": doc.events[i].priceDate
						};
						returnRecord[m] = re;
						m++;
					}
					if (doc.events[i].price > 0 && doc.events[i].invoiceDone == true && doc.events[i].completed == false) {
						waitCount = waitCount + doc.events[i].price;
						applicantDate = doc.events[i].invoiceDate;
						var wait = {
							"name": doc.events[i].title,
							"amount": doc.events[i].price,
							"date": doc.events[i].invoiceDate
						};
						waitRecord[n] = wait;
						n++;
					}
					if (doc.events[i].price > 0 && doc.events[i].invoiceDone == false && doc.events[i].completed == false) {
						var should = {
							"name": doc.events[i].title,
							"amount": doc.events[i].price
						};
						unreturnRecord[k] = should;
						k++;
					}
					if (flag == 0 && doc.events[i].price > 0 && doc.events[i].completed == true && (doc.events[i].date < getOccur || doc.events[i].date == getOccur)) {
						lastDate = doc.events[i].date;
						flag = 1;
					}
					if (flag == 1 && doc.events[i].price > 0 && doc.events[i].completed == true && doc.events[i].date < getOccur && doc.events[i].date > lastDate) {
						lastDate = doc.events[i].date;
					}
				}
				var unreturnCount = allCount - count - waitCount;
				var conData = {
					"conName": doc.name,
					"partyA": doc.partyA,
					"partyB": doc.partyB,
					"returnRecord": returnRecord,
					"waitRecord": waitRecord,
					"unreturnRecord": unreturnRecord,
					"applicantDate": applicantDate,
					"lastDate": lastDate,
					"waitCount": waitCount,
					"amount": doc.amount,
					"count": count,
					"unreturnCount": unreturnCount
				}
				// funData[index] = [doc.name, doc.partyA, doc.partyB, returnRecord, waitRecord, unreturnRecord, applicantDate, lastDate, waitCount, allCount, count, unreturnCount];
				funData[index] = conData;
				index++;
			});
			callback(funData);
		});
	},

	//转移文件
	upload: function(getData, getFileID, callback) {
		var getDir = "/deploy/BusinessMate/files/" + getFileID;
		///async test
		if (getData == undefined) {
			callback("no file");
		} else {
			async.forEach(getData, function(item, callback) {
				var tempPath = "/deploy/BusinessMate/uploads/" + item.tempid;
				var getName = "/deploy/BusinessMate/files/" + getFileID + "/" + item.name;
				fs.exists(getDir, function(check) {
					// console.log(check);
					if (check == true) {
						fs.readFile(tempPath, function(err, data) {
							console.log(data);
							fs.writeFile(getName, data, function(err) {
								console.log("success save");
							});
						});
					} else {
						fs.mkdir(getDir, 0777, function() {
							// console.log("no");
							fs.readFile(tempPath, function(err, data) {
								// console.log(data);
								fs.writeFile(getName, data, function(err) {
									// console.log("success save");
								});
							});
						});
					}

				});
			});
			callback("good");
		}
	},

	//新建合同插入数据库
	/*
	 * rdata:要保存的合同对象
	 */
	insertData: function(rdata, callback) {

		Contract = this.model('Contract');
		var contract = new Contract(rdata);
		contract.save(function(err, obj) {
			Contract.find({
				_id: obj._id
			}, {
				_id: 1
			}, function(err, identify) {
				callback(identify);
			});

		});
	},

	//新建合同模版插入模版数据库
	/*
	 * rdata:要保存的合同对象
	 */
	insertTemplate: function(rdata, res) {

		Template = this.model('Template');
		// console.log("insert");
		var template = new Template(rdata);
		template.save();
		res.send({
			hello: "success insert"
		});
	},

	//根据id修改指定合同
	/*
	 * id:合同<_id,id>
	 * result:传递要修改的字段JSON对象
	 * callback:回调返回数据
	 */
	updateIdData: function(id, result, callback) {

		Contract = this.model('Contract');
		var contract = new Contract();
		Contract.update(id, result, function() {
			Contract.find(id, function(err, docs) {
				callback(docs);
			});
		});
	},

	//根据id修改指定合同模版
	/*
	 * id:合同模版<_id,id>
	 * result:传递要修改的字段JSON对象
	 * callback:回调返回数据
	 */
	updateIdTemplate: function(id, result, callback) {

		Template = this.model('Template');
		Template.update(id, result, function() {
			Template.find(id, function(err, docs) {
				callback(docs);
			});
		});
	},

	//根据id删除指定合同
	/*
	 * id:合同<_id,id>
	 * callback:回调返回数据
	 */
	removeData: function(id, callback) {

		Contract = this.model('Contract');
		Contract.remove(id, function() {
			Contract.find({
				_id: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	//根据id删除指定合同模版
	/*
	 * id:合同模版<_id,id>
	 * callback:回调返回数据
	 */
	removeTemplate: function(id, callback) {

		Template = this.model('Template');
		Template.remove(id, function() {
			Template.find(id, function(err, docs) {
				callback(docs);
			});
		});
	},

	//清空contracts容器接口
	removeAllData: function(callback) {

		Contract = this.model('Contract');
		Contract.remove({}, function() {
			Contract.find({}, function(err, docs) {
				callback(docs);
			});
		});
	},

	//修改合同事件完成标志,并同时更新合同状态,引入发票触发
	/*
	 * id:合同id
	 * eventId:事件id
	 * eventName:事件名称 (或是状态名称,方便跟踪合同状态)
	 * callback:回调返回数据
	 */
	updateSymbol: function(id, eventId, checkValue, remark, eventName, newDate, callback) {

		Contract = this.model('Contract');
		Contract.find({
			_id: id
		}, function(err, results) {
			results.forEach(function(result) {
				for (var i = 0; i < result.events.length; i++) {
					if (result.events[i].id == eventId) {
						if (result.events[i].invoiceDone == false) {
							Contract.update({
								_id: id,
								"events.id": eventId
							}, {
								"$set": {
									"events.$.invoiceDone": checkValue,
									"events.$.invoiceDate": newDate,
									//state: eventName + "开发票",
									"events.$.date": result.events[i].priceDate
								}
							}, function() {
								Contract.find({
									_id: id
								}, function(err, docs) {
									callback(docs);
								});
							});
						} else if (result.events[i].invoiceDone == true) {
							Contract.update({
								_id: id,
								"events.id": eventId
							}, {
								"$set": {
									"events.$.completed": checkValue,
									"events.$.priceDate": newDate,
									"events.$.date": newDate
								}
							}, function() {
								Contract.find({
									_id: id
								}, function(err, docs) {
									callback(docs);
								});
							});
						} else {
							Contract.update({
								_id: id,
								"events.id": eventId
							}, {
								"$set": {
									"events.$.completed": checkValue,
									"events.$.date": newDate,
									//state: eventName
								}
							}, function() {
								Contract.find({
									_id: id
								}, function(err, docs) {
									callback(docs);
								});
							});
						}
					}
				}
			});
		});
	},

	//追踪合同状态(以最晚的那个完成事件追踪)
	/*
	 *id:合同id
	 *calback:回调返回数据
	 */
	updateState: function(id, callback) {

		Contract = this.model('Contract');
		console.log("updateState");

		Contract.find({
			_id: id
		}, function(err, results) {
			results.forEach(function(result) {
				var latestEvent,
					latestDate = "";
				for (var i = 0; i < result.events.length; i++) {
					if (result.events[i].price > 0 && result.events[i].invoiceDone == true && result.events[i].completed == false) {
						if (result.events[i].invoiceDate > latestDate) {
							latestDate = result.events[i].invoiceDate;
							latestEvent = result.events[i].title + "开发票";
						}
					}
					if (result.events[i].price > 0 && result.events[i].completed == true) {
						if (result.events[i].priceDate > latestDate) {
							latestDate = result.events[i].priceDate;
							latestEvent = result.events[i].title;
						}
					}
					if (result.events[i].price == -1 && result.events[i].completed == true) {
						// console.log(result.events[i]);
						if (result.events[i].date > latestDate) {
							// console.log("自定义");
							latestDate = result.events[i].date;
							latestEvent = result.events[i].title;
						}
					}
				}
				Contract.update({
					_id: id
				}, {
					"$set": {
						state: latestEvent
					}
				}, function() {
					Contract.find({
						_id: id
					}, function(err, docs) {
						callback(docs);
					});
				});
			});
		});
	},

	//计算所有合同的事件回收金额
	/*
	 *calback:回调返回数据
	 */
	countGetMoney: function(callback) {

		var count = 0; //存储所有合同已回款总额
		var allCount = 0; //存储所有合同总金额
		var getData;
		Contract = this.model('Contract');

		Contract.find({}, function(err, docs) {
			docs.forEach(function(doc) {
				allCount = allCount + doc.amount;
				for (var i = 0; i < doc.events.length; i++) { //遍历单个合同的事件数组
					if (doc.events[i].price > 0 && doc.events[i].completed == true)
					//					if (doc.events[i].price > 0)
						count = count + doc.events[i].price;
				}
				getData = {
					"allCount": allCount,
					"count": count,
					"ratio": parseFloat(count / allCount)
				};
				// console.log(doc.events);
			});
			callback(getData);
		});
	},

	//计算所有合同的事件在未来指定时间段内可回收的金额
	/*
	 *getTime:获取目标时间(从当前时间-目标时间,计算可回收金额)
	 *calback:回调返回数据
	 */
	countWillGetMoney: function(getTime, callback) {

		var count = 0; //存储所有合同已回款总额
		var allCount = 0; //存储所有合同总金额
		var getData;
		var occur = new Date();
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		Contract = this.model('Contract');

		Contract.find({}, function(err, docs) {
			docs.forEach(function(doc) {
				// console.log(doc.name);
				for (var i = 0; i < doc.events.length; i++) { //遍历单个合同的事件数组
					if (doc.events[i].price > 0 && (doc.events[i].date > getOccur || doc.events[i].date == getOccur) && (doc.events[i].date < getTime || doc.events[i].date == getTime)) {
						//在指定时间段内,假如是回款事件,将该事件列入统计之内
						count = count + doc.events[i].price;
					}
				}
				getData = {
					"count": count
				};
			});
			callback(getData);
		});
	},

	//计算所有合同的事件在过去指定时间段内已回收的金额
	/*
	 *getTime:获取目标时间(从当前时间-目标时间,计算可回收金额)
	 *calback:回调返回数据
	 */
	countHadGotMoney: function(getTime, callback) {

		var count = 0; //存储所有合同已回款总额
		var allCount = 0; //存储所有合同总金额
		var getData;
		var occur = new Date();
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		Contract = this.model('Contract');

		Contract.find({}, function(err, docs) {
			docs.forEach(function(doc) {
				// console.log(doc.name);
				for (var i = 0; i < doc.events.length; i++) { //遍历单个合同的事件数组
					if (doc.events[i].price > 0 && (doc.events[i].date < getOccur || doc.events[i].date == getOccur) && (doc.events[i].date > getTime || doc.events[i].date == getTime)) {
						//在指定时间段内,假如是回款事件,将该事件列入统计之内
						count = count + doc.events[i].price;
					}
				}
				getData = {
					"count": count
				};
			});
			// console.log(parseFloat(4 / 10));
			callback(getData);
		});
	},

	//计算单个合同的事件回收金额
	/*
	 *calback:回调返回数据
	 */
	countOneGetMoney: function(id, callback) {

		var count = 0; //存储该合同已回款总额
		var allCount = 0; //存储该合同总金额
		var waitCount = 0; //待回款
		var returnRecord = []; //已回款记录
		var m = 0;
		var waitRecord = []; //待回款记录
		var n = 0;
		var unreturnRecord = []; //未回款记录
		var k = 0;
		var getData;
		var flag = 0;
		var lastDate = "无";
		var applicantDate = "无";
		var occur = new Date();
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		Contract = this.model('Contract');

		Contract.find({
			_id: id
		}, function(err, docs) {
			docs.forEach(function(doc) {
				allCount = doc.amount;
				for (var i = 0; i < doc.events.length; i++) { //遍历该合同的事件数组
					if (doc.events[i].price > 0 && doc.events[i].completed == true) {
						count = count + doc.events[i].price;
						var re = {
							"name": doc.events[i].title,
							"amount": doc.events[i].price,
							"date": doc.events[i].priceDate
						};
						returnRecord[m] = re;
						m++;
					}
					if (doc.events[i].price > 0 && doc.events[i].invoiceDone == true && doc.events[i].completed == false) {
						waitCount = waitCount + doc.events[i].price;
						applicantDate = doc.events[i].invoiceDate;
						var wait = {
							"name": doc.events[i].title,
							"amount": doc.events[i].price,
							"date": doc.events[i].invoiceDate
						};
						waitRecord[n] = wait;
						n++;
					}
					if (doc.events[i].price > 0 && doc.events[i].invoiceDone == false && doc.events[i].completed == false) {
						var should = {
							"name": doc.events[i].title,
							"amount": doc.events[i].price
						};
						unreturnRecord[k] = should;
						k++;
					}
					if (flag == 0 && doc.events[i].price > 0 && doc.events[i].completed == true && (doc.events[i].date < getOccur || doc.events[i].date == getOccur)) {
						lastDate = doc.events[i].date;
						flag = 1;
					}
					if (flag == 1 && doc.events[i].price > 0 && doc.events[i].completed == true && doc.events[i].date < getOccur && doc.events[i].date > lastDate) {
						lastDate = doc.events[i].date;
					}
				}
				getData = {
					"applicantDate": applicantDate, //发票申请时间
					"lastDate": lastDate, //上次回款日期
					"waitCount": waitCount, //待收款=开了申请发票的回款金额
					"oneAllCount": allCount, //该合同总金额
					"returnCount": count, //已回款
					"unreturnCount": allCount - count - waitCount, //应回款=总金额-已回款-待收款
					"returnRecord": returnRecord, //已回款记录[{已回款事件,该事件金额}]
					"waitRecord": waitRecord, //待回款记录
					"unreturnRecord": unreturnRecord, //应回款记录
					"returnRatio": parseFloat(count / allCount), //已回款比率
					"unreturnRatio": parseFloat((allCount - count) / allCount) //未回款比率
				};
				// console.log(doc.events);
			});
			callback(getData);
		});
	},

	//计算合同的合同款,总金额
	/*
	 *calback:回调返回数据
	 */
	countGraphics: function(beginDate, endDate, rules, callback) {


		var allGetData; //返回数据json
		var allGetCount = 0; //所有合同总金额
		var allWaitCount = 0; //所有合同待回款
		var allReturnCount = 0; //所有合同已回款
		var allUnreturnCount = 0; //所有合同应收款

		var occur = new Date();
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		Contract = this.model('Contract');
		Contract.find(rules, function(err, docs) {
			docs.forEach(function(doc) {
				var count = 0; //存储该合同已回款总额
				var allCount = 0; //存储该合同总金额
				var waitCount = 0; //该合同待回款金额
				var unreturnCount = 0; //应回款金额
				var flag = 0; //标志位
				var getData; //该合同数据json
				allCount = doc.amount;
				for (var i = 0; i < doc.events.length; i++) { //遍历该合同的事件数组
					if ((beginDate < doc.events[i].priceDate || beginDate == doc.events[i].priceDate) && (doc.events[i].priceDate < endDate || doc.events[i].priceDate == endDate)) {
						// console.log("good girl");
						if (doc.events[i].price > 0 && doc.events[i].completed == true) {
							count = count + doc.events[i].price;
						}
						if (doc.events[i].price > 0 && doc.events[i].invoiceDone == true && doc.events[i].completed == false) {
							waitCount = waitCount + doc.events[i].price;
							applicantDate = doc.events[i].invoiceDate;
						}
						if (doc.events[i].price > 0 && doc.events[i].invoiceDone == false && doc.events[i].completed == false) {
							unreturnCount = unreturnCount + doc.events[i].price;
						}
						if (flag == 0 && doc.events[i].price > 0 && doc.events[i].completed == true && (doc.events[i].date < getOccur || doc.events[i].date == getOccur)) {
							lastDate = doc.events[i].date;
							flag = 1;
						}
						if (flag == 1 && doc.events[i].price > 0 && doc.events[i].completed == true && doc.events[i].date < getOccur && doc.events[i].date > lastDate) {
							lastDate = doc.events[i].date;
						}
					}
				}
				getData = {
					"waitCount": waitCount, //待收款=开了申请发票的回款金额
					"oneAllCount": allCount, //该合同总金额
					"returnCount": count, //已回款
					"unreturnCount": unreturnCount, //应回款=总金额-已回款-待收款
				};
				allGetCount = allGetCount + getData.oneAllCount;
				allWaitCount = allWaitCount + getData.waitCount;
				allReturnCount = allReturnCount + getData.returnCount;
				allUnreturnCount = allUnreturnCount + getData.unreturnCount;

			});
			allGetData = {
				"allGetCount": allGetCount, //所有合同总金额
				"allWaitCount": allWaitCount, //所有合同待回款
				"allReturnCount": allReturnCount, //所有合同已回款
				"allUnreturnCount": allUnreturnCount //所有合同应收款
			};
			callback(allGetData);
		});
	},

	//根据合同id,展示所有未完成事件以及下一个待办事件
	/*
	 *id:合同id
	 *calback:回调返回数据
	 */
	checkUndoneEvents: function(id, callback) {

		Contract = this.model('Contract');
		var send = []; //用数组来存储未完成事件
		var j = 0; //未完成事件数组下标控制器
		var m = 0; //大于当前时间数组下标控制器
		var occur = new Date();
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		//转换成标准时间格式
		var getTemp;
		var flag = 0;
		//找到第一个比当前执行日期大的事件标志位
		var canGet = 0;
		//存在下一步事件标志位
		var next;
		//存储下一步执行事件
		var willSend;
		//存储发送数据
		Contract.find({
			_id: id
		}, function(err, docs) {
			docs.forEach(function(doc) {
				for (var i = 0; i < doc.events.length; i++) { //遍历该合同数组
					if (doc.events[i].completed == false && doc.events[i].date < getOccur) {
						send[j] = doc.events[i]; //当状态为未完成状态,取出
						j++; //下标移动
					}
				}
				for (var k = 0; k < doc.events.length; k++) {
					if (flag == 0 && (doc.events[k].date > getOccur || doc.events[k].date == getOccur) && doc.events[k].completed == false) {
						//找到第一个大于或等于当前时间的事件而且还没完成的事件
						getTemp = doc.events[k].date; //把该事件的执行日期赋给临时时间
						next = doc.events[k];
						flag = 1;
						canGet = 1;
					}
					if (flag == 1 && doc.events[k].date > getOccur && doc.events[k].date < getTemp && doc.events[k].completed == false) {
						//之后要是存在比当前时间大并且比临时时间小的而且还没完成的事件,更新临时时间,并且更新下一步执行事件
						getTemp = doc.events[k].date;
						next = doc.events[k];
					}
				}
				if (canGet == 0) {
					next = 0; //合同已经结束
				}
				willSend = {
					"name": doc.name,
					"undone": send,
					"next": next
				};
				// console.log(willSend);
				callback(willSend);
			});
		});
	},

	//展示所有所有合同未完成事件以及下一个待办事件
	/*
	 *calback:回调返回数据
	 */
	checkAllUndoneEvents: function(rules, roles, name, callback) {

		Contract = this.model('Contract');

		var s = 0; //合同待办事件数组下标控制器
		///获取当前时间
		var occur = new Date(); //
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		//转换成标准时间格式
		var getTemp; //临时设定事件执行目标时间

		////获取一周之后的时间
		var weekLater = new Date(occur.getTime() + 1000 * 60 * 60 * 24 * 7);
		var tyear = weekLater.getFullYear();
		var tmonth = weekLater.getMonth() + 1;
		var tday = weekLater.getDate(); ///
		tday = tday < 10 ? "0" + tday : tday;
		tmonth = tmonth < 10 ? "0" + tmonth : tmonth;
		var getWeekLater = tyear + "-" + tmonth + "-" + tday;
		// console.log(getWeekLater);

		var allWillSend = [];
		//存储所有合同数据

		Contract.find(rules, function(err, data) {
			if (roles[0] == 'corpoBusinessAssistant' || roles[0] == 'regionalAssistant' || (roles[0] == 'corpoBusinessAssistant' && roles[1] == 'regionalAssistant') || (roles[0] == 'regionalAssistant' && roles[1] == 'corpoBusinessAssistant')) {
				console.log(11);
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
			data.forEach(function(doc) {

				var willSend; //存储单个合同数据
				var send = []; //用数组来存储未完成事件
				var j = 0; //未完成事件数组下标控制器
				var flag = 0;
				//找到第一个比当前执行日期大的事件标志位
				var next = { //存在下一步事件标志位,初始化下步执行事件变量
					"id": 0,
					"title": 0,
					"date": 0,
					"price": 0,
					"completed": 0
				};

				for (var i = 0; i < doc.events.length; i++) { //遍历该合同数组
					if (doc.events[i].completed == false && doc.events[i].date < getOccur && doc.events[i].price == -1) {
						send[j] = doc.events[i]; //当状态为未完成状态,取出
						j++; //下标移动
					}
					if (doc.events[i].completed == false && doc.events[i].invoiceDone == true && doc.events[i].priceDate < getOccur && doc.events[i].price > 0) {
						send[j] = doc.events[i]; //当状态为未完成状态,取出回款事件
						j++; //下标移动
					}
					if (doc.events[i].completed == false && doc.events[i].invoiceDone == false && doc.events[i].invoiceDate < getOccur && doc.events[i].price > 0) {
						send[j] = doc.events[i]; //当状态为未完成状态,取出发票事件
						j++; //下标移动
					}
				}
				// console.log(getOccur);
				for (var k = 0; k < doc.events.length; k++) {
					if (flag == 0 && (doc.events[k].date > getOccur || doc.events[k].date == getOccur) && (doc.events[k].date < getWeekLater || doc.events[k].date == getWeekLater) && doc.events[k].completed == false) {
						//找到第一个大于或等于当前时间的事件而且还没完成的事件
						getTemp = doc.events[k].date; //把该事件的执行日期赋给临时时间
						next = doc.events[k];
						flag = 1;
					}
					if (flag == 1 && (doc.events[k].date > getOccur || doc.events[k].date == getOccur) && doc.events[k].date < getTemp && doc.events[k].completed == false) {
						//之后要是存在比当前时间大并且比临时时间小的而且还没完成的事件,更新临时时间,并且更新下一步执行事件
						getTemp = doc.events[k].date;
						next = doc.events[k];
					}
				}
				/*
				if (canGet == 0) {
					next = 0; //合同已经结束
				}
				*/
				willSend = {
					"name": doc.name,
					"_id": doc._id,
					"undone": send,
					"next": next
				};
				// console.log(willSend);
				allWillSend[s] = willSend;
				s++;
			});
			callback(allWillSend);
		});
	},

	//展示上周完成事件
	checkLastWeekDone: function(rules, roles, name, callback) {

		Contract = this.model('Contract');

		var s = 0; //合同待办事件数组下标控制器
		///获取当前时间
		var occur = new Date(); //
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		//转换成标准时间格式
		var getTemp; //临时设定事件执行目标时间

		////获取一周之后的时间
		var lastWeek = new Date(occur.getTime() - 1000 * 60 * 60 * 24 * 7);
		var tyear = lastWeek.getFullYear();
		var tmonth = lastWeek.getMonth() + 1;
		var tday = lastWeek.getDate(); ///
		tday = tday < 10 ? "0" + tday : tday;
		tmonth = tmonth < 10 ? "0" + tmonth : tmonth;
		var getLastWeek = tyear + "-" + tmonth + "-" + tday;
		var allWillSend = [];
		//存储所有合同数据

		Contract.find(rules, function(err, data) {
			if (roles[0] == 'corpoBusinessAssistant' || roles[0] == 'regionalAssistant' || (roles[0] == 'corpoBusinessAssistant' && roles[1] == 'regionalAssistant') || (roles[0] == 'regionalAssistant' && roles[1] == 'corpoBusinessAssistant')) {
				console.log(11);
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
			data.forEach(function(doc) {

				var willSend; //存储单个合同数据
				var send = []; //用数组来存储未完成事件
				var j = 0; //未完成事件数组下标控制器
				var flag = 0;

				for (var i = 0; i < doc.events.length; i++) { //遍历该合同数组
					if (doc.events[i].invoiceDone == true && (doc.events[i].invoiceDate < getOccur || doc.events[i].invoiceDate == getOccur) && (doc.events[i].invoiceDate > getLastWeek || doc.events[i].invoiceDaye == getLastWeek)) {
						send[j] = doc.events[i]; //当状态为未完成状态,取出
						j++; //下标移动
					}
					if (doc.events[i].completed == true && (doc.events[i].date < getOccur || doc.events[i].date == getOccur) && (doc.events[i].date > getLastWeek || doc.events[i].date == getLastWeek)) {
						send[j] = doc.events[i]; //当状态为未完成状态,取出
						j++; //下标移动
					}
				}

				willSend = {
					"name": doc.name,
					"_id": doc._id,
					"done": send
				};
				// console.log(willSend);
				allWillSend[s] = willSend;
				s++;
			});
			callback(allWillSend);
		});
	},

	//展示所有所有已完成合同
	/*
	 *calback:回调返回数据
	 */
	checkAlldoneContracts: function(callback) {

		Contract = this.model('Contract');
		var send = []; //用数组来存储未完成事件
		var j = 0; //未完成事件数组下标控制器
		Contract.find({}, function(err, docs) {
			docs.forEach(function(doc) {

				var willSend; //存储单个合同数据

				var getOne;

				var flag = 0;
				//找到第一个比当前执行日期大的事件标志位

				for (var i = 0; i < doc.events.length; i++) {
					if (doc.events[i].completed == false) {
						flag = 1;
					}
				}
				if (flag == 0) {
					getOne = {
						"name": doc.name
					};
					send[j] = getOne;
					j++;
				} else
					flag = 0;
			});
			callback(send);
		});
	},

	/*模糊查询
	 *option:获取查询条件json
	 *callback:返回数据
	 */
	fuzzySearch: function(rule, option, callback) {
		Contract = this.model('Contract');
		/*构建查询条件 时间段 and （其他字段 or 模糊查询）*/
		var beginDate = {
			"$gte": option.beginDate,
			"$lte": option.endDate
		};
		var orArr = new Array();
		var keyword = option.keyword;
		if (option.myId) { //采购编号
			var myId = new RegExp(keyword);
			var orOption1 = {
				"myId": {
					"$all": [myId]
				}
			};
			orArr.push(orOption1);
		}
		if (option.name) { //合同名称
			var name = new RegExp(keyword);
			var orOption2 = {
				"name": {
					"$all": [name]
				}
			};
			orArr.push(orOption2);
		}
		if (option.partyA) { //甲方
			var partyA = new RegExp(keyword);
			var orOption3 = {
				"partyA": {
					"$all": [partyA]
				}
			};
			orArr.push(orOption3);
		}
		if (option.partyB) { //乙方
			var partyB = new RegExp(keyword);
			var orOption4 = {
				"partyB": {
					"$all": [partyB]
				}
			};
			orArr.push(orOption4);
		}
		if (option.amount & !isNaN(keyword)) { //合同金额 数字类型不作模糊查询处理 

			var orOption5 = {
				"amount": keyword
			};
			orArr.push(orOption5);
		}
		if (option.state) { //状态
			var state = new RegExp(keyword);
			var orOption6 = {
				"state": {
					"$all": [state]
				}
			};
			orArr.push(orOption6);
		}
		var findOption;
		if (orArr.length === 0) {
			findOption = {
				"beginDate": beginDate
			};
		} else {
			findOption = {
				$and: [{
					"beginDate": beginDate
				}, {
					$or: orArr
				}, {
					$or: rule
				}]
			};
		}
		/*构建查询条件 ----------------------------------结束*/
		Contract.find(findOption, function(err, docs) {
			callback(docs);
		});
	},

	/*简单查询
	 *option:获取查询条件json
	 *callback:返回数据
	 */
	simpleSearch: function(rule, option, callback) {
		Contract = this.model('Contract');
		/*构建查询条件 时间段 and （其他字段 or 模糊查询）*/
		var beginDate = {
			"$gte": option.beginDate,
			"$lte": option.endDate
		};
		var orArr = new Array();
		var keyword = option.keyword;
		//采购编号
		var myId = new RegExp(keyword);
		var orOption1 = {
			"myId": {
				"$all": [myId]
			}
		};
		orArr.push(orOption1);
		//合同名称
		var name = new RegExp(keyword);
		var orOption2 = {
			"name": {
				"$all": [name]
			}
		};
		orArr.push(orOption2);
		//日期
		var date = new RegExp(keyword);
		var findOption;
		findOption = {
			$and: [{
				"beginDate": beginDate
			}, {
				$or: orArr
			}, {
				$or: rule
			}]
		};
		/*构建查询条件 ----------------------------------结束*/
		Contract.find(findOption, function(err, docs) {
			callback(docs);
		});
	},

	///////////////////////重构测试接口
	countAllGotMoney: function(rules, callback) {

		var waitCount = 0; //待回款
		var allReturnRecord = []; //所有合同已回款记录
		var a = 0;
		var allWaitRecord = []; //所有合同待回款记录
		var b = 0;
		var allUnreturnRecord = []; //所有合同未回款记录
		var c = 0;

		var send = []; // 发送的数据
		var r = 0;
		var getData;
		var getResult;
		var flag = 0;
		var lastDate = "无";
		var applicantDate = "无";
		var occur = new Date();
		var year = occur.getFullYear();
		var month = occur.getMonth() + 1;
		var day = occur.getDate(); ///
		day = day < 10 ? "0" + day : day;
		month = month < 10 ? "0" + month : month;
		var getOccur = year + "-" + month + "-" + day;
		Contract = this.model('Contract');

		Contract.find(rules, function(err, docs) {
			docs.forEach(function(doc) {
				var returnRecord = []; //单份已回款记录(合同名称,甲方,乙方,合同金额,回款金额,回款比例,回款日期,备注)
				var m = 0;
				var waitRecord = []; //单份待回款记录(合同名称,甲方,乙方,合同金额,回款金额,回款比例,申请时间,预期回款时间,备注)
				var n = 0;
				var unreturnRecord = []; //单份未回款记录(合同名称,甲方,乙方,合同金额,回款金额,回款比例,备注)
				var k = 0;

				for (var i = 0; i < doc.events.length; i++) { //遍历该合同的事件数组
					if (doc.events[i].price > 0 && doc.events[i].completed == true) {
						// count = count + doc.events[i].price;
						re = {
							"contractName": doc.name,
							"_id": doc._id,
							"partyA": doc.partyA,
							"partyB": doc.partyB,
							"partyAabbr": doc.partyAabbr,
							"partyBabbr": doc.partyBabbr,
							"amount": doc.amount,
							"title": doc.events[i].title,
							"returnAmount": doc.events[i].price,
							"date": doc.events[i].priceDate,
							"state": doc.state,
							"returnRatio": ""
						};
						returnRecord[m] = re;
						m++;
					}
					if (doc.events[i].price > 0 && doc.events[i].invoiceDone == true && doc.events[i].completed == false) {
						applicantDate = doc.events[i].invoiceDate;
						wait = {
							"contractName": doc.name,
							"_id": doc._id,
							"partyA": doc.partyA,
							"partyB": doc.partyB,
							"partyAabbr": doc.partyAabbr,
							"partyBabbr": doc.partyBabbr,
							"amount": doc.amount,
							"title": doc.events[i].title,
							"waitAmount": doc.events[i].price,
							"date": doc.events[i].invoiceDate,
							"priceDate": doc.events[i].priceDate,
							"state": doc.state,
							"returnRatio": ""
						};
						waitRecord[n] = wait;
						n++;
					}
					if (doc.events[i].price > 0 && doc.events[i].invoiceDone == false && doc.events[i].completed == false) {
						should = {
							"contractName": doc.name,
							"_id": doc._id,
							"partyA": doc.partyA,
							"partyB": doc.partyB,
							"partyAabbr": doc.partyAabbr,
							"partyBabbr": doc.partyBabbr,
							"amount": doc.amount,
							"title": doc.events[i].title,
							"unreturnAmount": doc.events[i].price,
							"priceDate": doc.events[i].priceDate,
							"state": doc.state,
							"returnRatio": ""
						};
						unreturnRecord[k] = should;
						k++;
					}
					if (flag == 0 && doc.events[i].price > 0 && doc.events[i].completed == true && (doc.events[i].date < getOccur || doc.events[i].date == getOccur)) {
						lastDate = doc.events[i].date;
						flag = 1;
					}
					if (flag == 1 && doc.events[i].price > 0 && doc.events[i].completed == true && doc.events[i].date < getOccur && doc.events[i].date > lastDate) {
						lastDate = doc.events[i].date;
					}
				}

				var getReturn = {
					"returnRecord": returnRecord,
					"returnRatio": doc.returnRatio
				};
				allReturnRecord[a] = getReturn;

				var getWait = {
					"waitRecord": waitRecord,
					"returnRatio": doc.returnRatio
				};
				allWaitRecord[b] = getWait;

				var getUnreturn = {
					"unreturnRecord": unreturnRecord,
					"returnRatio": doc.returnRatio
				};
				allUnreturnRecord[c] = getUnreturn;

				a++;
				b++;
				c++;

			});
			callback({
				"allReturnRecord": allReturnRecord,
				"allWaitRecord": allWaitRecord,
				"allUnreturnRecord": allUnreturnRecord
			});
		});
	},
	getPieData: function(pdata, rules, callback) {
		var id = pdata._id;
		var partyType = pdata.partyType;

		Contract = this.model('Contract');

		var sendData = [];
		var tempParty;
		console.log("rules", rules);
		Contract.find(rules, function(err, docs) {
			console.log("rules", rules);
			var partyId;
			docs.forEach(function(doc) {
				//判断查询的是甲方公司还是乙方公司 1为甲方公司 2为乙方公司
				if (partyType == "1") {
					partyId = stringToHex(doc.partyAabbr);
				} else {
					partyId = stringToHex(doc.partyBabbr);
				}
				if ((partyId == id) && (pdata.startDate < doc.beginDate || pdata.startDate == doc.beginDate) && (doc.beginDate < pdata.endDate || pdata.endDate == doc.beginDate)) {

					if (stringToHex(doc.partyAabbr) == id)
						tempParty = doc.partyA;
					else
						tempParty = doc.partyB;

					var tempData = [];

					tempData.push(doc.name);
					tempData.push(doc.partyAabbr);
					tempData.push(doc.partyBabbr);
					tempData.push(doc.amount);
					tempData.push(doc.state);
					tempData.push(doc.partyA);
					tempData.push(doc.partyB);
					tempData.push(doc._id);

					sendData.push(tempData);
				}
			});

			var reData = {
				rData: sendData,
				name: tempParty
			};

			callback(reData);
		});

		var stringToHex = function(str) {
			var val = "";
			for (var i in str) {
				if (val == "")
					val = str.charCodeAt(i).toString(16);
				else
					val += "," + str.charCodeAt(i).toString(16);
			}
			return val;
		};
	},

	/*
	 *计算全年回款计划,[{"January","return":100,amount:"200"}]
	 *
	 */
	countInfoOneYear: function(year, rules, callback) {

		var allGetData; //返回数据json
		var allGetCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //所有合同总金额
		var count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //按月回款金额统计
		var returnCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //按月已回款统计

		var begin = year + "-01-01";
		var end = year + "-12-31";

		Contract = this.model('Contract');
		Contract.find(rules, function(err, docs) {
			docs.forEach(function(doc) {
				var t_amount = 0; //存储该合同已回款总额
				var allCount = 0; //存储该合同总金额
				var getData; //该合同数据json
				allCount = doc.amount;
				for (var i = 0; i < doc.events.length; i++) { //遍历该合同的事件数组
					// console.log(doc.events[i]);
					if (doc.events[i].price > 0 && (begin < doc.events[i].priceDate || begin == doc.events[i].priceDate) && (doc.events[i].priceDate < end || end == doc.events[i].priceDate)) {
						// console.log(doc.events[i]);
						var eventDate = new Date(doc.events[i].priceDate);
						var month = eventDate.getMonth();
						count[month] = count[month] + doc.events[i].price;
						allGetCount[month] = allGetCount[month] + doc.events[i].price;
						if (doc.events[i].completed == true) {
							returnCount[month] = returnCount[month] + doc.events[i].price;
						}
					}
				}
			});
			allGetData = {
				"allGetCount": allGetCount, //所有合同总金额
				"count": count,
				"returnCount": returnCount
			};
			// console.log(parseFloat(4 / 10));
			callback(allGetData);
		});
	},
	countMonthEvents: function(year, month, rules, callback) {

		var allGetData; //返回数据json
		var send = [];
		var j = 0;
		var returnSend = [];
		var k = 0;

		var begin = year + "-01-01";
		var end = year + "-12-31";

		Contract = this.model('Contract');
		Contract.find(rules, function(err, docs) {
			docs.forEach(function(doc) {

				for (var i = 0; i < doc.events.length; i++) { //遍历该合同的事件数组
					//	console.log(doc.events[i]);
					if (doc.events[i].price > 0 && (begin < doc.events[i].priceDate || begin == doc.events[i].priceDate) && (doc.events[i].priceDate < end || end == doc.events[i].priceDate)) {
						var eventDate = new Date(doc.events[i].priceDate);
						var t_month = eventDate.getMonth() + 1;
						// console.log(t_month);
						if (t_month == month) {
							// console.log("has...");
							var get = {
								"id": doc._id,
								"name": doc.name,
								"amount": doc.amount,
								"title": doc.events[i].title,
								"partyAabbr": doc.partyAabbr,
								"partyBabbr": doc.partyBabbr,
								"priceDate": doc.events[i].priceDate,
								"price": doc.events[i].price
							};
							send[j] = get;
							j++;
							// console.log(get);
							if (doc.events[i].completed == true) {
								var returnGet = {
									"id": doc._id,
									"name": doc.name,
									"amount": doc.amount,
									"title": doc.events[i].title,
									"partyAabbr": doc.partyAabbr,
									"partyBabbr": doc.partyBabbr,
									"priceDate": doc.events[i].priceDate,
									"price": doc.events[i].price
								};
								returnSend[k] = returnGet;
								k++;
							}
						}
					}
				}
			});
			allGetData = {
				"events": send, //所有指定年月的合同款项
				"returnEvents": returnSend
			};
			callback(allGetData);
		});
	}
};

Repository.enhanceSchema(ContractSchema);

mongoose.model('Contract', ContractSchema); //创建新合同对象,数据库中对应contracs容器
mongoose.model('Template', ContractSchema); //创建合同模版对象,对应templates容器
mongoose.model('purchases', PurchaseSchema); //创建采购模型对象