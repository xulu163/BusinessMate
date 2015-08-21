var mongoose = require('mongoose'),
	apiUser = mongoose.model('apiUser');

exports.pass = function(req, res, next) {
	var token = req.query.token;
	var user = new apiUser();
	user.findToken({_id : token}, function(result) {
		//console.log(result);
		if(result == "success"){
			//console.log(result);
			next();
		}
		else{
			res.send('no privilige!');
		}
	});
};

exports.test = function(req,res,next){

	console.log("app-auth test");
	next();
};
