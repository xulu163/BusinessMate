var mongoose = require('mongoose'),
	notify = require('./notify'),
    notifyApi = require('./notifyApi');

exports.authpass = function(req,res,next){
	// console.log("user:");
	// console.log(req.user);
	// console.log(req.query.token);
	if(req.query.token != undefined){
		//如果有token表示是系统，进入系统验证
		 console.log("sys");
		notifyApi.pass(req,res,next);
	} else if (req.query.token == undefined){
		 console.log("user");
		notify.pass(req,res,next);
		// if(req.user == "" || req.user == undefined){
		// 	res.send("no privilige!");
		// } else {
		// 	next();
		// }
	}
	//  else if(req.query.token == undefined && !req.user){
	// 	console.log("no privilige!");
	// 	res.send("no privilige!");
	// }else if(req.query.token == undefined && req.user){
	// 	//没有token表示是用户，进入用户验证
	// 	//notify.pass(req,res,next);
	// 	next();
	// }
};