$(function() {
	var initStart = $("#getStart").val();
	var initEnd = $("#getEnd").val();
	console.info("initStart = " + initStart + "initEnd = " + initEnd);


	var today = new Date();
	var mounth = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
	var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
	var todayFormat = today.getFullYear() + "-" + mounth + "-" + day;
	var startDate = today.getFullYear() + "-01-01";
	var endDate = today.getFullYear() + "-12-31";
	/*对数据进行前台排序*/
	var sortType = "date"; //默认按日期排序
	var order = "desc"; //默认倒序排列

	$('#fbeginDate').datepicker({
		autoclose: true,
		todayBtn: true,
	});
	$('#fendDate').datepicker({
		autoclose: true,
		todayBtn: true,
	});

	//表格下载
	$("#exportExcel_fun").click(function() {
		console.info("exportExcel_fun--export");

		var $postJson = {};
		$postJson.startDate = $('#fbeginDate').val();
		$postJson.endDate = $('#fendDate').val();
		var url = "/api/contracts/return/excel/" + JSON.stringify($postJson);
		window.location = url;

	});


	//定义取小数点后两位函数

	var changeTwoDecimal = function(x) {
		var f_x = parseFloat(x);
		if (isNaN(f_x))
			return false;
		var f_x = Math.round(x * 100) / 100;
		var s_x = f_x.toString();
		var pos_decimal = s_x.indexOf('.');
		if (pos_decimal < 0) {
			pos_decimal = s_x.length;
			s_x += '.';
		}
		while (s_x.length <= pos_decimal + 2) {
			s_x += '0';
		}
		return s_x;
	};
	var authority = function() {
		$.ajax({
			url: '/api/roleresource/desktop/sidenav', //获取用户所拥有的资源
			type: 'get',
			success: function(data) {
				var userResources = data.data;
				console.info("==========userResources=========");
				console.info(userResources);
				var delFlag = 0;
				var updateFlag = 0;
				var excelFlag = 0;

				$.each(userResources, function(i, itemData) {
					var oper = itemData.oper;
					var url = itemData.resource;

					if (url == "/api/contracts/return/excel/:keywords") {
						console.info(url);
						if (oper == "get") {
							excelFlag = 1;
						}
					}

				});

				if (excelFlag == 0) {
					$("#exportExcel_fun").css('display', 'none');
				}

			}
		});

	};
	var initialize = function(cpage, start, end, sortType, order) {
		authority();
		var item = $("#item  option:selected").text();
		console.info("item");
		console.info(item);

		var $postJson = {};
		$postJson.item = item;
		$postJson.index = cpage;
		$postJson.bDate = start;
		$postJson.eDate = end;
		$postJson.sortType = sortType;
		$postJson.order = order;

		$.ajax({
			url: '/api/contracts/tasks/return/' + JSON.stringify($postJson),
			type: 'get',
			// data: data,
			success: function(data) {
				if (!showPri(data)) {
					return;
				}
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
						initialize(newPage, start, end, sortType, order);
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

	if (initStart != "" && initEnd != "") {
		$('#fbeginDate').val(initStart);
		$('#fendDate').val(initEnd);
		initialize(1, initStart, initEnd, sortType, order);
	} else {
		$('#fbeginDate').val(startDate);
		$('#fendDate').val(endDate);
		console.info("startDate = " + startDate);
		initialize(1, startDate, endDate, sortType, order);
	};

	var serializeData = function(data) {
		$('#table1').html('');
		if (data == "") {
			$("#paginator").html("");
			$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>没有相关信息</div>");
			return;
		} else {
			$('#tip').html("");
		}
		$.each(data, function(i, itemData) {

			var contractName = itemData.contractName;
			if (contractName.length > 15) {
				contractName = contractName.substring(0, 15) + "...";
			}

			//金钱逗号隔开显示
			s1 = itemData.amount + "";
			itemData.amount = "￥" + s1.replace(/\B(?=(?:\d{3})+$)/g, ',');

			s2 = itemData.returnAmount + "";
			itemData.returnAmount = "￥" + s2.replace(/\B(?=(?:\d{3})+$)/g, ',');

			var tempData = {
				name: contractName,
				partyAabbr: itemData.partyAabbr,
				partyBabbr: itemData.partyBabbr,
				amount: itemData.amount,
				returnAmount: itemData.returnAmount,
				returnRatio: itemData.returnRatio,
				date: itemData.date,
				state: itemData.title
			};

			// console.info(tempData);
			var curRatio = changeTwoDecimal((tempData.returnRatio) * 100);
			if (!curRatio)
				curRatio = 0;
			var easypieRatio = "<div style='margin:0px;padding:1px' class='progress' data-percent='" + curRatio + "%'><div class='bar' style='width:" + curRatio + "%;'></div></div>";
			// var template = "<tr><td class='center' style='width:200px'><a href='/contracts/" + contract._id + "/edit'>{{name}}</td><td class='hidden-480 center'>{{partyA}}</td><td class='hidden-480 center'>{{partyB}}</td><td class='center'>{{amount}}</td><td  class='center'>{{returnAmount}}</td><td class='hidden-phone center'>" + easypieRatio2 + "</td><td class='hidden-phone center'>{{applicantDate}}</td><td  class='center'>{{remark}}</td></tr>";
			var template = "<tr><td class=center title='" + itemData.contractName + "'><a href='/contracts/" + itemData._id + "/edit'>{{name}}</a></td><td class='hidden-480 center'>{{partyAabbr}}</td><td class='hidden-480 center'>{{partyBabbr}}</td><td class='center'>{{amount}}</td><td class=center>{{returnAmount}}</td><td class='hidden-phone center'>" + easypieRatio + "</td><td class='hidden-480 center'>{{date}}</td><td class='hidden-480 center'>{{state}}</td></tr>"

			var $html = $(Mustache.to_html(template, tempData));

			$('#table1').append($html);

			var oldie = $.browser.msie && $.browser.version < 9;
			$('.easy-pie-chart2.percentage').each(function() {
				var barColor = $(this).data('color');
				var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
				var size = parseInt($(this).data('size')) || 50;
				$(this).easyPieChart({
					barColor: barColor,
					trackColor: trackColor,
					scaleColor: false,
					lineCap: 'butt',
					lineWidth: parseInt(size / 10),
					animate: oldie ? false : 1000,
					size: size
				});
			});

		});

	};

	$('#item').change(function() {
		var item = $("#item  option:selected").text();
		console.info(item);
		var start = $('#fbeginDate').val();
		var end = $('#fendDate').val();
		initialize(1, start, end, sortType, order);
	});

	//加入搜索功能 
	$('#fsearchBtn').click(function() {
		var start = $('#fbeginDate').val();
		var end = $('#fendDate').val();
		initialize(1, start, end, sortType, order);
	});

	//点击排序，进行数据排序
	$(".sortTd").click(function() {
		var sortClass = $(this).attr("class");
		//获取排序顺序和排序类型（根据什么字段排序）
		var _sortType = $(this).find("span").text().trim();
		switch (_sortType) {
			case "合同金额":
				{
					sortType = "amount";
					break;
				}
			case "回款金额":
				{
					sortType = "returnAmount";
					break;
				}
			case "回款比率":
				{
					sortType = "returnRatio";
					break;
				}
			case "回款日期":
				{
					sortType = "date";
					break;
				}
		}
		//前台样式效果
		var data;
		$.each($(".sortTd"), function(index, e) {
			switch (index) {
				case 0:
					{
						$(e).removeClass().addClass("nouse center sortTd nouse1");
						break;
					}
				case 1:
					{
						$(e).removeClass().addClass("nouse center sortTd nouse1");
						break;
					}
				case 2:
					{
						$(e).removeClass().addClass("hidden-phone center sortTd nouse1");
						break;
					}
				case 3:
					{
						$(e).removeClass().addClass("hidden-480 center sortTd nouse1");
						break;
					}
			}
		});
		var sortArr = sortClass.split(" ");
		if ("nouse1" === sortArr[3]) {
			order = "asc";
			$(this).removeClass().addClass("nouse center sortTd showAsc");
		} else if ("showDesc" === sortArr[3]) {
			order = "asc";
			$(this).removeClass().addClass("nouse center sortTd showAsc");
		} else if ("showAsc" === sortArr[3]) {
			order = "desc";
			$(this).removeClass().addClass("nouse center sortTd showDesc");
		}
		var start = $('#fbeginDate').val();
		var end = $('#fendDate').val();
		initialize(1, start, end, sortType, order);
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
});