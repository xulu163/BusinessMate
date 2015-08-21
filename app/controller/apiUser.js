var mongoose = require('mongoose'),
	apiUser = mongoose.model('apiUser');

//授权（接受用户名密码，插入到数据库，
//生成_id作为token返回给客户端，客户端通过该token访问api）
exports.authApi = function(req, res) {
	console.log("authApi");
	var appkey = req.query.appkey;
	var secret = req.query.secret;
	if (appkey != 'forever_pms' || secret != 'forever_smp') {
		res.send("auth fail");
		return;
	}
	var uData = {
		appkey: appkey,
		secret: secret
	};

	console.info(uData);
	var user = new apiUser();
	user.insertUser(uData, function(result) {
		var access_token = result._id;
		if (result = 'success') {
			console.log("access_token:" + access_token);
			res.send(access_token);
		}
	});
};