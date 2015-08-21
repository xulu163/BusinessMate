var mongoose = require('mongoose'),
	UserRole = mongoose.model('UserRole');

exports.data = function(req,res,next){
	var uid = req.user.uid;
	var userRole = new UserRole();
	var status = req.session.status;
	userRole.findOne(uid, function(user) {
		var name = user[0].username;
		var regin = req.user.regin;
		// console.log(req.user);
		// console.log("regin");
		// console.log(regin);
		var oldRoles = user[0].role;
		var roles = exports.init(status, oldRoles);
		var rule = [];
		for (var i = 0; i < roles.length; i++){
			var role = roles[i];
			console.log(role);
			if (role == 'Admin')
				rule.push({});
			else if (role == 'headLeader' || role == 'corpoBusinessManager')
				rule.push({});
			else if (role == 'corpoBusinessAssistant')
				rule.push({});
			else if (role == 'regionalBusinessManager')
				rule.push({'business_person': name});
			else if (role == 'regionalSalesManage')
				rule.push({'contract_dept': regin});
			else if (role == 'salers')
				rule.push({'sals_person': name});
			else if (role == 'regionalHead'){
				rule.push({'contract_dept': regin});
				rule.push({'partyBDept':regin});
			}
			else if(role == 'regionalAssistant'){
				rule.push({'events.customEve_person': name});
				rule.push({'events.priceEve_person1': name});
				rule.push({'events.priceEve_person2': name});
			}
		}
		console.log("rule-----????:::",rule);
		console.log("-----------------------");
		req.session.roles = roles;
		req.session.rule = rule;
		next();
	});
};
exports.init = function(status, roles){
	var newRoles = [];
	if(status == "salers"){
		newRoles.push("salers");
	} else {
		for(var i = 0; i < roles.length; i ++){
			if(roles[i] != "salers"){
				newRoles.push(roles[i]);
			}
		}
	}
	return newRoles;
};
exports.desktop = function(req, res, next){
	console.log("hello");
	var uid = req.user.uid;
	var userRole = new UserRole();
	var status = req.session.status;
	userRole.findOne(uid, function(user) {
		var name = user[0].username;
		var regin = req.user.regin;
		var oldRoles = user[0].role;
		var roles = exports.init(status, oldRoles);
		console.log("roles:::", roles);
		var rule = [];
		for (var i = 0; i < roles.length; i++){
			var role = roles[i];
			console.log(role);
			if (role == 'Admin' || role == 'headLeader' || role == 'corpoBusinessManager' || role == 'corpoBusinessAssistant')
				rule.push({});
			else if (role == 'regionalBusinessManager'){
				rule.push({'business_person': name});
				rule.push({'contract_dept': regin});
			}
			else if (role == 'regionalSalesManage')
				rule.push({'contract_dept': regin});
			else if (role == 'salers')
				rule.push({'sals_person': name});
			else if (role == 'regionalHead'){
				rule.push({'contract_dept': regin});
				rule.push({'partyBDept':regin});
			}
			else if(role == 'regionalAssistant'){
				rule.push({'contract_dept': regin});
			}
		}
		console.log(rule);
		console.log("-----------------------");

		req.session.desktopRule = rule;
		next();
	});
}