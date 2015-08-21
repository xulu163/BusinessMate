var mongoose = require('mongoose'),
	Contract = mongoose.model('Contract');

exports.detail = function(req, res) {
	var contract = new Contract();
	var getData = req.params['postData'];
	var obj = JSON.parse(getData);
	var index = obj.index;
	var item = obj.item;
	var party = obj.party;
	var startDate = obj.startDate;
	var endDate = obj.endDate;
	var partyType = obj.pieType;
	var begin = item * (index - 1);
	var end = item * index - 1;
	var rule = req.session.rule;
	var rules = {
		$or: rule
	};
	var pdata = {
		_id: party,
		startDate: startDate,
		endDate: endDate,
		partyType: partyType
	};

	contract.getPieData(pdata, rules, function(data) {
		var tdata = data.rData;
		var returnData = [];
		if (tdata.length < end)
			end = tdata.length - 1;
		var j = 0;
		for (var i = begin; i <= end; i++) {
			returnData[j] = tdata[i];
			j++;
		}

		var sData = {
			count: tdata.length,
			data: returnData
		};

		res.send(sData);
	});
};