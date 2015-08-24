/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Repository = require('./repository');

var UserSchema = mongoose.Schema({ //创建合同模型对象
	uid: String, //用户账号
	provider: String, //
	username: String, //用户名
	realname: String, //真实姓名
	email: String, //邮箱
	password: String, //密码
	regin: String //归属区域
});

UserSchema.methods = {
	test: function() {
		console.info("=======test");
	},

	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate: function(plainText) {

		//密码解密
		var crypto = require('crypto');
		var key = "asdhjwheru*asd123-123"; //加密的秘钥
		var decipher = crypto.createDecipher('aes-256-cbc', key);

		var dec = decipher.update(this.password, 'hex', 'utf8');

		dec += decipher.final('utf8'); //解密之后的值
		console.log("----------------------------密码解密");
		console.log(dec);
		this.password = dec;
		return plainText == this.password;
	},

	getUnique: function(callback) { //构造唯一id赋予用户

		var myDate = new Date();
		var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
		var month = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
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
		var uniqueNum = year + month + day + hour + minute + second + millSecond;
		console.log(uniqueNum);
		callback(uniqueNum);
	},

	checkUserInfo: function(callback) {

		this.model('User').find({}, {
			uid: 1,
			username: 1,
			realname: 1,
			email: 1,
			password: 1,
			regin: 1
		}, function(err, docs) {
			callback(docs);
		});
	},

	checkUserIdData: function(id, callback) {

		this.model('User').find(id, function(err, docs) {
			console.log("====show====");
			callback(docs);
		});
	},

	insertUserData: function(rdata) {

		User = this.model('User');
		var user = new User(rdata);
		user.save();
		console.log("insert successfully");
	},

	removeUserData: function(id, callback) {

		User = this.model('User');
		User.remove({
			uid: id
		}, function() {
			User.find({
				uid: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	updateUser: function(id, userResult, callback) {

		User = this.model('User');
		User.update({
			uid: id
		}, userResult, function() {
			User.find({
				uid: id
			}, function(err, docs) {
				callback(docs);
			});
		});
	},

	checkUsername: function(username, callback) {

		this.model('User').find({
			username: username
		}, function(err, docs) {
			callback(docs);
		});
	}
};

mongoose.model('User', UserSchema); //创建新合同对象,并关联到模型