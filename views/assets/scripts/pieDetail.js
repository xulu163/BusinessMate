$(function() {

	var airline = $('#pieID').val();
	console.info("airline" + airline);
	var pieType = $("#pieType").val();
	var start = $("#getStart").val();
	var end = $("#getEnd").val();

	//加入导出功能
	$('#exportExcel_pie').click(function() {
		var type = $("#pieType").val();
		var url;
		var $postJson = {};
		$postJson.id = airline;
		$postJson.partyType = pieType;
		$postJson.startDate = start;
		$postJson.endDate = end;
		if (type == "1") {
			url = "/api/contracts/" + JSON.stringify($postJson) + "/partyA/excel"; //甲方公司
		} else {
			url = "/api/contracts/" + JSON.stringify($postJson) + "/partyB/excel"; //乙方公司
		}
		// var url = '/api/contracts/pieExcel/' + airline;
		window.location = url;
	});

	function stringToHex(str) {
		var val = "";
		for (var i in str) {
			if (val == "")
				val = str.charCodeAt(i).toString(16);
			else
				val += "," + str.charCodeAt(i).toString(16);
		}
		return val;
	}

	var initialize = function(cpage) {
		var item = $("#item  option:selected").text();

		console.info("start=" + start + "end=" + end);
		$("#showTime").html("(" + start + "至" + end + ")");


		var $postJson = {};
		$postJson.item = item;
		$postJson.index = cpage;
		$postJson.party = airline;
		$postJson.startDate = start;
		$postJson.endDate = end;
		$postJson.pieType = pieType;

		$.ajax({
			url: '/api/pieDetail/' + JSON.stringify($postJson),
			type: 'get',
			// data: data,
			success: function(data) {
				console.info(data.count);
				var page;

				//若总共的合同数少于要求展示的条数，则1页展示
				if (data.count < item)
					page = 1;
				else
					page = Math.ceil(data.count / item);

				var options = {
					currentPage: cpage,
					totalPages: page,
					alignment: 'right',
					onPageChanged: function(e, oldPage, newPage) {
						initialize(newPage);
					}
				};

				$('#paginator').bootstrapPaginator(options);
				serializeData(data.data);

			},
			error: function(result) {
				console.info('error');
			}
		});
	};

	initialize(1);

	var serializeData = function(data) {
		$('#pieTable').html('');

		$.each(data, function(i, itemData) {

			console.info("itemData here");
			console.info(itemData);
			console.info(itemData[0]);
			var contractName = itemData[0];
			if (contractName.length > 10) {
				contractName = contractName.substring(0, 9) + "...";
			}
			//金钱逗号隔开显示
			s1 = itemData[3] + "";
			var amount = "￥" + s1.replace(/\B(?=(?:\d{3})+$)/g, ',');

			var tempData = {
				name: contractName,
				partyA: itemData[1],
				partyB: itemData[2],
				amount: amount,
				state: itemData[4]
			};

			console.info(tempData);

			if (stringToHex(itemData[1]) == airline)
				$("#detailValue").html(itemData[5]);
			else
				$("#detailValue").html(itemData[6]);

			var template = "<tr><td class='center span3' title='" + itemData[0] + "'>{{name}}</td><td class='center span2'>{{partyA}}</td><td class='center span2'>{{partyB}}</td><td class='center span2'>{{amount}}</td><td class='center span2'>{{state}}</td></tr>";

			var $html = $(Mustache.to_html(template, tempData));
			$html.click(function() {
				window.location.href = "/contracts/" + itemData[7] + "/edit";
			});
			$('#pieTable').append($html);

		});

	};

	$('#item').change(function() {
		var item = $("#item  option:selected").text();
		console.info(item);
		initialize(1);
	});

});