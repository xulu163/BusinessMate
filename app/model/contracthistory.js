/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	async = require('async'),
	fs = require('fs'),
	Repository = require('./repository');

var ContractshistorySchema = mongoose.Schema({ //业务日志模型
	contractName: String, //合同名
	contractId: String, //合同id
	time: String, //时间
	getNew: Number, //版本
	data: {}
});

ContractshistorySchema.methods = {
	test: function() {
		console.info("=======test");
	},

	insertBusiness: function(logData, callback) {

		Contractshistory = this.model('Contractshistory');
		console.log("insert");
		contractshistory = new Contractshistory(logData);
		contractshistory.save();
		callback("insertBusiness successfully.");
	},

	findOneGroup: function(getId, callback) {

		var send = [];
		var i = 0;
		Contractshistory = this.model('Contractshistory');
		Contractshistory.find({
			contractId: getId
		}, function(err, docs) {
			docs.forEach(function(doc) {
				var myDate = new Date(doc.time);
				var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
				var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				var day = myDate.getDate(); //获取当前日(1-31)
				var hour = myDate.getHours(); //获取当前小时数(0-23)
				var minute = myDate.getMinutes(); //获取当前分钟数(0-59)
				var second = myDate.getSeconds(); //获取当前秒数(0-59)
				var millSecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
				month = month < 10 ? "0" + month : month;
				day = day < 10 ? "0" + day : day;
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				millSecond = millSecond < 100 ? (millSecond < 10 ? "00" + millSecond : "0" + millSecond) : millSecond;
				var uniqueNum = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
				var get = {
					contractName: doc.contractName,
					time: uniqueNum,
					getNew: doc.getNew,
					_id: doc._id
				};
				send[i] = get;
				i++;
			});
			callback(send);
		});
	},

	findOneBusiness: function(getId, versionId, callback) { ///传入合同id,版本id,返回指定数据
		Contractshistory = this.model('Contractshistory');
		Contractshistory.find({
			getNew: versionId,
			contractId: getId
		}, function(err, ver) {
			console.log(ver);
			var myDate = new Date(ver[0].time);
			var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
			var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
			var day = myDate.getDate(); //获取当前日(1-31)
			var hour = myDate.getHours(); //获取当前小时数(0-23)
			var minute = myDate.getMinutes(); //获取当前分钟数(0-59)
			var second = myDate.getSeconds(); //获取当前秒数(0-59)
			var millSecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? "0" + day : day;
			hour = hour < 10 ? "0" + hour : hour;
			minute = minute < 10 ? "0" + minute : minute;
			second = second < 10 ? "0" + second : second;
			millSecond = millSecond < 100 ? (millSecond < 10 ? "00" + millSecond : "0" + millSecond) : millSecond;
			var uniqueNum = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
			var get = {
				contractId: ver[0].contractId,
				contractName: ver[0].contractName,
				time: uniqueNum,
				getNew: ver[0].getNew,
				data: ver[0].data
			};
			console.log(get);
			callback(get);
		});
	},

	findBusiness: function(getId, callback) { ///传入版本id,组建新版本
		Contractshistory = this.model('Contractshistory');
		Contractshistory.find({
			_id: getId
		}, function(err, ver) {
			console.log(ver);
			callback(ver);
		});
	},

	findVersionId: function(getId, callback) { ///传入合同id,找到版本最大的合同,返回版本id
		console.log("findVersionId");
		Contractshistory = this.model('Contractshistory');
		var max = 0;
		var returnId = "";
		Contractshistory.find({
			contractId: getId
		}, function(err, vers) {
			async.forEach(vers, function(ver) { ///假如该合同版本已经被删除,程序不会进入回调函数
				if (ver.getNew == undefined) {
					returnId = ver._id;
				} else {
					if (ver.getNew > max || ver.getNew == max) {
						returnId = ver._id;
						max = ver.getNew;
					}
				}
			});
			callback(returnId);
		});
	},

	findAllBusiness: function(callback) {

		var send = [];
		var i = 0;
		this.model('Contractshistory').find({}, function(err, docs) {
			docs.forEach(function(doc) {
				var myDate = new Date(doc.time);
				var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
				var month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
				var day = myDate.getDate(); //获取当前日(1-31)
				var hour = myDate.getHours(); //获取当前小时数(0-23)
				var minute = myDate.getMinutes(); //获取当前分钟数(0-59)
				var second = myDate.getSeconds(); //获取当前秒数(0-59)
				var millSecond = myDate.getMilliseconds(); //获取当前毫秒数(0-999)
				month = month < 10 ? "0" + month : month;
				day = day < 10 ? "0" + day : day;
				hour = hour < 10 ? "0" + hour : hour;
				minute = minute < 10 ? "0" + minute : minute;
				second = second < 10 ? "0" + second : second;
				millSecond = millSecond < 100 ? (millSecond < 10 ? "00" + millSecond : "0" + millSecond) : millSecond;
				var uniqueNum = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
				var get = {

					contractId: doc.contractId,
					contractName: doc.contractName,
					time: uniqueNum,
					getNew: doc.getNew,
					data: doc.data
				};
				send[i] = get;
				i++;
			});
			callback(send);
		});
	},

	removeVersion: function(getId, versionId, callback) {
		Contractshistory = this.model('Contractshistory');
		Contractshistory.remove({
			contractId: getId,
			_id: versionId
		}, function() {
			Contractshistory.find({
				_id: versionId
			}, function(err, docs) {
				console.log("goodremove");
				callback(docs);
			});
		});
	}
};

mongoose.model('Contractshistory', ContractshistorySchema); //创建新文件对象,并关联到模型