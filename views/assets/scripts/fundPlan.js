$(function() {

	var date = new Date();
	var year = date.getFullYear();
	var selectedYear = year;

	//initialize item of year
	var initializeItem = function(year) {
		$('#yearItem').html('');
		var planYear = year + 5;

		for (var i = planYear - 2000; i >= 0; i--) {

			var yearTemplate = "<option>" + planYear + "</option>";

			$('#yearItem').append(yearTemplate);
			planYear--;
		}
		for (var i = 0; i < $("#yearItem option").length; i++) {
			if ($("#yearItem ").get(0).options[i].value == year) {
				$("#yearItem").get(0).options[i].selected = true;
				break;
			}
		}
	};

	initializeItem(year);

	//initialize the fund of all year 
	var initialize = function(year) {
		var data = {
			year: year
		};
		selectedYear = year;

		$.ajax({
			url: "/api/contracts/statistical/" + year,
			type: "get",
			// data : data,
			success: function(data) {
				if (!showPri(data)) {
					return;
				}
				showMonthList(data);
			},
			error: function(result) {
				bootbox.alert("获取全年回款数据失败！");
			}
		});

	};

	var showMonthList = function(data) {
		$('#table_plan').html('');
		var allGetCount = data.allGetCount;
		var returnCount = data.returnCount;
		// console.info("=====showMonthList=======selectedYear" + selectedYear);

		var yearCount = 0; //全年合同总额
		var yearReturn = 0; //全年回款总额
		for (var i = 0; i < allGetCount.length; i++) {
			yearCount += allGetCount[i];
			yearReturn += returnCount[i];
			//金额每三位用逗号隔开
			var s1 = allGetCount[i] + "";
			var amount = "￥" + s1.replace(/\B(?=(?:\d{3})+$)/g, ',');
			var s2 = returnCount[i] + "";
			var retur = "￥" + s2.replace(/\B(?=(?:\d{3})+$)/g, ',');

			var templateData = {
				month: i + 1 + "月",
				planFund: amount,
				fund: retur
			};
			var $postJson = {};
			$postJson.year = selectedYear;
			$postJson.month = i + 1;
			var selectedMonth = i + 1;

			var template = "<tr><td class=center>{{month}}</td><td class=center><a href='/contracts/statistical/" + selectedYear + "/" + selectedMonth + "/1'>{{planFund}}</td><td class=center><a href='/contracts/statistical/" + selectedYear + "/" + selectedMonth + "/2'>{{fund}}</td></tr>";

			var $html = $(Mustache.to_html(template, templateData));
			$('#table_plan').append($html);
		}

		var s3 = yearCount + "";
		var oneYearCount = "￥" + s3.replace(/\B(?=(?:\d{3})+$)/g, ',');
		var s4 = yearReturn + "";
		var oneYearReturn = "￥" + s4.replace(/\B(?=(?:\d{3})+$)/g, ',');
		var templateData = {
			yearCount: oneYearCount,
			yearReturn: oneYearReturn
		};
		var template = "<tr><td class=center>总计</td><td class=center><a href='#'>{{yearCount}}</td><td class=center><a href='#'>{{yearReturn}}</td></tr>";

		var $html = $(Mustache.to_html(template, templateData));
		$('#table_plan').append($html);

	};

	initialize(year);

	$('#yearItem').change(function() {
		var itemValue = $("#yearItem").find("option:selected").text();
		initialize(itemValue);
	});

});

/*判断是否有权限 false提示*/

function showPri(data) {
	if (data == "without privilege") {
		$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>您没有查看权限！</div>");
		return false;
	} else {
		$('#tip').html("");
		return true;
	}
}