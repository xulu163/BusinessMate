var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var apiUserSchema = new Schema({
	username: String, //用户名
	password: String //密码
});

apiUserSchema.methods = {
	//向数据库中插入一条用户信息，数据库会生成一个唯一的_id
	insertUser: function(data, callback) {
		apiUser = this.model('apiUser');
		var aUser = new apiUser(data);

		aUser.save(function(err, obj) {
			if (err)
				callback(err);
			console.info(obj);
			callback(obj);
		});
	},

	//查找是否有满足的token
	findToken: function(token, callback) {
		console.info("token");
		console.info(token);
		var check = false;
		this.model('apiUser').find({}, function(err, docs) {
			docs.forEach(function(doc) {
				if (doc._id == token._id)
					check = true;
			});

			if (check)
				callback('success');
			else
				callback('fail');
		});
	}
};
mongoose.model('apiUser', apiUserSchema);