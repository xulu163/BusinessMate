var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	Repository = require('./repository');

var CompanySchema = new Schema({
	cid: String,
	cType: String, //公司类型（甲方乙方）
	cFullName: String, //公司全称
	cAbbreviation: String, //公司简称
	cAddr: String, //公司地址
	cOffiWeb: String, //公司官网
	cTel: String, //联系方式
	cEmail: String, //公司邮箱
});

CompanySchema.methods = {

	/**
	 *新增公司信息
	 */
	create: function(data, callback) {
		Company = this.model('Company');
		var company = new Company(data);
		company.save();
		console.log("save success");
		callback(data);
	},

	/**
	 *获取甲方或乙方所有公司的信息
	 */
	show: function(type, callback) {
		console.log("-------------");
		Company = this.model('Company');
		Company.find({
			"cType": type
		}, function(err, docs) {
			callback(docs);
		});
	},

	/**
	 *修改公司信息
	 */
	update: function(id, result, callback) {
		Company = this.model('Company');
		console.log("-----heheh-");
		Company.update({
			"cid": id
		}, result, function(result) {
			callback(result);
		});
	},

	/**
	 *删除指定id的公司信息
	 */
	delete: function(id, callback) {
		Company = this.model('Company');
		Company.remove({
			cid: id
		}, function(err, docs) {
			callback(docs);
		});
	},

	/**
	 *初始化指定id的公司信息
	 */
	initEdit: function(id, callback) {
		console.log("init====");
		Company = this.model('Company');
		Company.find({
			'cid': id
		}, function(err, docs) {
			callback(docs);
		});
	},

	//转移文件
	upload: function(data, callback) {
		console.log("upload");
		console.log(getData);
		var getData = data.file;
		var getFileID = data.cid;
		var getDir = "/deploy/BusinessMate/files/" + getFileID;
		///async test
		if (getData == undefined) {
			callback("no file");
		} else {
			async.forEach(getData, function(item, callback) {
				var tempPath = "/deploy/BusinessMate/uploads/" + item.tempid;
				var getName = "/deploy/BusinessMate/files/" + getFileID + "/" + item.name;
				console.log(tempPath);
				console.log(getName);
				fs.exists(getDir, function(check) {
					console.log(check);
					if (check == true) {
						console.log("yes");
						fs.readFile(tempPath, function(err, data) {
							console.log(data);
							fs.writeFile(getName, data, function(err) {
								console.log("success save");
							});
						});
					} else {
						fs.mkdir(getDir, 0777, function() {
							console.log("no");
							fs.readFile(tempPath, function(err, data) {
								console.log(data);
								fs.writeFile(getName, data, function(err) {
									console.log("success save");
								});
							});
						});
					}
				});
			});
			callback(data);
		}
	}
};

mongoose.model('Company', CompanySchema);