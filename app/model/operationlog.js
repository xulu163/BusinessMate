/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	fs = require('fs'),
	Repository = require('./repository');

var OperationlogSchema = mongoose.Schema({ //日志模型
	resource: String, //URL
	user: String, //用户名
	time: String, //时间
	operation: String, //操作类型
	data: {}
});

OperationlogSchema.methods = {

	test: function() {
		console.info("=======test");
	},

	insertRecord: function(logData, callback) {

		Operationlog = this.model('Operationlog');
		console.log("insert");
		var operationlog = new Operationlog(logData);
		operationlog.save();
		callback("insertRecord successfully.");
	},

	findOne: function(getId, callback) {
		this.model('Operationlog').find({
				_id: getId
			}, {
				data: 1
			},
			function(err, docs) {
				callback(docs);
			});
	},

	//test bugin--------
	findLimit: function(skip, limit, callback) {
		var send = [];
		var i = 0;
		var length = "";
		this.model('Operationlog').find().count(function(err, data) {
			length = data;
		});
		console.log("xuxu");
		console.log(length);
		this.model('Operationlog').find().skip(skip).limit(limit).exec(function(err, docs) {
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

					resource: doc.resource, //URL
					user: doc.user, //用户名
					time: uniqueNum, //时间
					operation: doc.operation, //操作类型
					data: doc.data,
					_id: doc._id
				};
				send[i] = get;
				i++;
			});
			console.log(".." + send);
			var data = {
				"count": length,
				"data": send
			};
			callback(data);
		});
	},

	//text end--------
	findAll: function(callback) {
		var send = [];
		var i = 0;

		this.model('Operationlog').find({}, {
			resource: 1,
			user: 1,
			time: 1,
			operation: 1,
			data: 1,
			_id: 1
		}, {
			sort: [
				['_id', -1]
			]
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

					resource: doc.resource, //URL
					user: doc.user, //用户名
					time: uniqueNum, //时间
					operation: doc.operation, //操作类型
					data: doc.data,
					_id: doc._id
				};
				send[i] = get;
				i++;
			});
			console.log(".." + send);
			callback(send);
		});
	}
};

mongoose.model('Operationlog', OperationlogSchema); //创建新文件对象,并关联到模型