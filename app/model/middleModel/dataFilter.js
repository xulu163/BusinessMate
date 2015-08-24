var mongoose = require('mongoose'),
	UserRole = mongoose.model('UserRole');

module.exports = {

	filter: function(uid, data, callback) {
		var userRole = new UserRole();

		userRole.findOne(uid, function(user) {
			var name = user[0].username;
			var roles = user[0].role;

			for (var i = 0; i < roles.length; i++) {
				var role = roles[i];

				if (role == 'admin')
					admin(name, data, callback);
				else if (role == 'headLeader' || role == 'corpoBusinessManager')
					headLeader(name, data, callback);
				else if (role == 'regionalHead')
					regionalHead(name, data, callback);
				else if (role == 'regionalBusinessManager')
					regionalBusinessManager(name, data, callback);
				else if (role == 'regionalSalesManage')
					regionalSalesManage(name, data, callback);
				else if (role == 'corpoBusinessAssistant' || role == 'regionalAssistant')
					corpoBusinessAssistant(name, data, callback);
				else if (role == 'salers')
					salers(name, data, callback);
			}

		});
	}

};


var admin = function(name, data, callback) {
	callback(data);
};

var headLeader = function(name, data, callback) {
	callback(data);
};

var regionalHead = function(name, data, callback) {
	callback(data);
};

var regionalSalesManage = function(name, data, callback) {
	callback(data);
};

var regionalBusinessManager = function(name, data, callback) {
	var tempData = new Array();

	for (var i = 0; i < data.data.length; i++) {
		var temp = data.data[i];
		//这里要先将sals_person转化为字母
		if (temp.business_person == name)
			tempData.push(temp);
	}

	var sendData = {
		data: tempData,
		count: tempData.length
	};

	callback(sendData);
};

var corpoBusinessAssistant = function(name, data, callback) {
	var tempData = new Array();

	for (var i = 0; i < data.data.length; i++) {
		var temp = data.data[i].events;
		var tempEvent = new Array();

		for (var j = 0; j < temp.length; j++) {
			if (temp[j].customEve_person == name || temp[j].priceEve_person1 == name || temp[j].priceEve_person2 == name)
				tempEvent.push(temp[j]);
		}

		temp.events = tempEvent;
		tempData.push(temp);
	}

	var sendData = {
		data: tempData,
		count: tempData.length
	};

	callback(sendData);
};

var salers = function(name, data, callback) {
	var tempData = new Array();

	for (var i = 0; i < data.data.length; i++) {
		var temp = data.data[i];
		//这里要先将sals_person转化为字母
		if (temp.sals_person == name)
			tempData.push(temp);
	}

	var sendData = {
		data: tempData,
		count: tempData.length
	};

	callback(sendData);
};

