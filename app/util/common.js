exports.redirect = function(req,res,path){
	res.send({
		redirectTo: path,
	});	
};