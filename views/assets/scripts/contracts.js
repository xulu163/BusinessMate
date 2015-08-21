$(function() {
	authority();
	initAll();
});

var sign; //用于事件操作的标识，判断是进行了哪个操作，如搜索
var searchType = "onSearch";
/*对数据进行前台排序*/
var sortType = "beginDate"; //默认按日期排序
var order = "desc"; //默认倒序排列
/*初始化 表格数据和分页样式,默认为当年的合同数据*/

function initAll() {
	sign = "initAll";
	var date = new Date();
	var bDate = date.getFullYear() + "-01-01";
	var todayFormat = getToday();
	$("#beginDate").val(bDate);
	$('#endDate').val(todayFormat);
	onCustomSearch();
}
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

				if (url == "/api/contracts/excel/:keywords") {
					console.info(url);
					if (oper == "get") {
						excelFlag = 1;
					}
				}

			});

			if (excelFlag == 0) {
				$("#exportContracts").css('display', 'none');
			}
		}
	});
};

function getToday() {
	var today = new Date();
	var mounth = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
	var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
	var todayFormat = today.getFullYear() + "-" + mounth + "-" + day;
	return todayFormat;
}
/*----------------初始化分页--------------------*/
/*totalPages 一共有多少页*/

function initPage(totalPages, option) {
	option = JSON.parse(option);
	var options = {
		currentPage: 1,
		totalPages: totalPages,
		alignment: "right",
		onPageClicked: function(e, originalEvent, type, page) {
			var url;
			var pageSize = $("#pageSize").val();
			var data;
			option.pageData.index = page;
			option.pageData.item = pageSize;
			option.pageData.sortType = sortType;
			option.pageData.order = order;
			data = option;
			data = JSON.stringify(data);
			url = 'api/contracts/' + data + '/search'
			$.ajax({
				url: url,
				type: "get",
				dataType: "json",
				success: function(data) {
					$('#contractsTbody').html("");
					showList(data.data);
					return;
				},
				error: function(data) {
					console.info(data + "error");
				}
			});
		}
	}
	$('#example').bootstrapPaginator(options);
}

/*----------------改变每页记录数时重载数据--------------------*/
$("#pageSize").change(function() {
	if (sign === "initAll") {
		initAll();
	} else if (sign === "onSearch") {
		onSearch();
	} else if (sign === "onCustomSearch") {
		searchType = "onCustomSearch";
		onCustomSearch();
	}
});

$("#exportContracts").click(function() {
	console.info("======exportContracts========");
	// sign = "onCustomSearch";
	var $pageSize = $("#pageSize").val();
	var checkId = $("#search_check_myId").is(':checked');
	var checkName = $("#search_check_name").is(':checked');
	var checkPartyA = $("#search_check_partyA").is(':checked');
	var checkPartyB = $("#search_check_partyB").is(':checked');
	var checkAmount = $("#search_check_amount").is(':checked');
	var checkState = $("#search_check_state").is(':checked');

	var $postJson = {};
	$postJson.searchType = "complex";
	$postJson.myId = checkId;
	$postJson.name = checkName;
	$postJson.partyA = checkPartyA;
	$postJson.partyB = checkPartyB;
	$postJson.amount = checkAmount;
	$postJson.state = checkState;
	$postJson.keyword = $("#search_keyword").val();
	$postJson.beginDate = $("#beginDate").val();
	$postJson.endDate = $("#endDate").val();
	var pageData = {
		"index": 1,
		"item": $pageSize,
		"sortType": sortType,
		"order": order
	}
	var postData = {
		"searchData": $postJson,
		"pageData": pageData
	}
	postData = JSON.stringify(postData);

	var url = "/api/contracts/excel/" + postData;
	// console.info(url);
	window.location = url;

});

$("#custom_search_panel").hide();
$('#beginDate').datepicker({
	autoclose: true,
	todayBtn: true,
});
$('#endDate').datepicker({
	autoclose: true,
	todayBtn: true,
});

var isDropDown = false;

$("#addContractBtn").click(function() {

});

$("#keyword").keypress(function(event) {
	if (event.keyCode == 13) {
		onSearch();
	}
});

$('#search_keyword').keypress(function(event) {
	if (event.keyCode == 13) {
		searchType = "onCustomSearch";
		onCustomSearch();
	}
});

$("#searchBtn").click(function() {
	onSearch();
});

$("#search_btn").click(function() {
	searchType = "onCustomSearch";
	onCustomSearch();
});


$("#drowdown").click(function() {
	if (!isDropDown) {
		isDropDown = true;
		$("#custom_search_panel").slideDown();
	} else {
		isDropDown = false;
		$("#custom_search_panel").slideUp();
	}

});

$("#removeBtn").click(function() {
	$("#custom_search_panel").slideUp();
	isDropDown = false;
});

$("#thisYear_btn").click(function() {
	changeYear(-1);
	onCustomSearch();
});

$("#lastYear_btn").click(function() {
	changeYear(1);
	onCustomSearch();
});

//改变高级搜索的时间 sign为1 年份加1 sign为-1 年份减1

function changeYear(sign) {
	var bDate = $("#beginDate").val();
	var eDate = $("#endDate").val();
	var bDateArr = bDate.split("-");
	var eDateArr = eDate.split("-");
	var bDateYear;
	var eDateYear;
	bDateYear = parseInt(bDateArr[0]) + sign;
	eDateYear = parseInt(eDateArr) + sign;
	bDate = bDateYear + "-01-01";
	eDate = eDateYear + "-12-31";
	$("#beginDate").val(bDate);
	$("#endDate").val(eDate);
}

function onSearch() {
	sign = "onSearch";
	var $keyword = $("#keyword").val();
	var $pageSize = $("#pageSize").val();
	var $postJson = {};
	if ($("#beginDate").val() > $("#endDate").val()) {
		bootbox.alert("合同搜索开始日期不能大于结束日期！");
		return;
	}
	$postJson.id = true;
	$postJson.name = true;
	$postJson.remark = true;
	$postJson.searchType = "simple";
	$postJson.keyword = $keyword;
	$postJson.beginDate = $("#beginDate").val();
	$postJson.endDate = $("#endDate").val();
	var pageData = {
		"index": 1,
		"item": $pageSize,
		"sortType": sortType,
		"order": order
	}
	var data1 = {
		"searchData": $postJson,
		"pageData": pageData
	}
	data1 = JSON.stringify(data1);
	$.ajax({
		url: '/api/contracts/' + data1 + '/search',
		type: "get",
		success: function(data) {
			if (!showPri(data)) {
				return;
			}
			$('#contractsTbody').html("");
			if (data.count != 0) {
				totalPages = Math.ceil(data.count / $pageSize);
				initPage(totalPages, data1);
			} else {
				$('#example').html("");
			}
			showList(data.data);
			return;
		},
		error: function(data) {
			console.info(data + "error");
		}
	});
}

function onCustomSearch(date) {
	sign = "onCustomSearch";
	var $pageSize = $("#pageSize").val();
	var checkId = $("#search_check_myId").is(':checked');
	var checkName = $("#search_check_name").is(':checked');
	var checkPartyA = $("#search_check_partyA").is(':checked');
	var checkPartyB = $("#search_check_partyB").is(':checked');
	var checkAmount = $("#search_check_amount").is(':checked');
	var checkState = $("#search_check_state").is(':checked');

	var $postJson = {};
	$postJson.searchType = "complex";
	$postJson.myId = checkId;
	$postJson.name = checkName;
	$postJson.partyA = checkPartyA;
	$postJson.partyB = checkPartyB;
	$postJson.amount = checkAmount;
	$postJson.state = checkState;
	$postJson.keyword = $("#search_keyword").val();
	$postJson.beginDate = date == null ? $("#beginDate").val() : date.beginDate;
	$postJson.endDate = date == null ? $("#endDate").val() : date.endDate;
	var pageData = {
		"index": 1,
		"item": $pageSize,
		"sortType": sortType,
		"order": order
	}
	var data1 = {
		"searchData": $postJson,
		"pageData": pageData
	}
	data1 = JSON.stringify(data1);
	$.ajax({
		url: '/api/contracts/' + data1 + '/search',
		type: "get",
		success: function(data) {
			if (!showPri(data)) {
				return;
			}
			//console.info("----------------------------luo");
			//console.info(pageSearchData);
			$('#contractsTbody').html("");
			if (data.count != 0) {
				totalPages = Math.ceil(data.count / $pageSize);
				initPage(totalPages, data1);
			} else {
				$('#example').html("");
			}
			showList(data.data);
			return;
		},
		error: function(data) {
			console.info("luoluoluo error");
			console.info(data + "error");
		}
	});
}


function showList(dataALL) {
	data = dataALL;
	if (data == "") {
		$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>未能搜索到相关合同信息</div>");
		return;
	} else {
		$('#tip').html("");
	}

	//判断data是单个元素还是多个元素，不然后面的遍历操作会将单个元素的对象所有属性遍历出来。
	if (!isArray(data)) {
		data = [data];
	}
	ids = [];
	$.each(data, function(index, item) {
		ids.push(item._id);
	});

	$('#contractsTbody').html("");
	$.each(data, function(index, item) {
		var titleLimitLength = 15;
		item._name = item.name;
		if (item.name.length > titleLimitLength) {
			item._name = item.name.substring(0, titleLimitLength) + "...";
		}

		if (item.partyAabbr == null || item.partyAabbr == "" || item.partyBabbr == null || item.partyVabbr == "") {
			item.partyAabbr = item.partyA;
			item.partyBabbr = item.partyB;
		}
		//金钱逗号隔开显示
		s = item.amount + "";
		item.amount = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
		/*-----获取回款比例里的数据--------t3data*/
		var returnRatio = item.returnRatio;
		console.info("returnRatio = " + returnRatio);
		returnRatio = changeTwoDecimal(returnRatio * 100);
		item.ids = ids;
		var easypieRatio3 = "<div style='margin:0px;padding:1px' class='progress' data-percent='" + returnRatio + "%'><div class='bar' style='width:" + returnRatio + "%;'></div></div>";

		var trTemplate = "<tr><td class='center hidden-480'><a href='/contracts/{{_id}}/edit?ids={{ids}}'>{{myId}}</a></td><td id='contract-title' class='center row-title' title='{{name}}'>{{_name}}</td><td class='center hidden-480'>{{partyAabbr}}</td><td class='center hidden-480'>{{partyBabbr}}</td><td class='center row-date hidden-480'>{{beginDate}}</td><td class='center'>{{amount}}</td><td class='center'>" + easypieRatio3 + "</td><td class='center hidden-480'>{{state}}</td></tr>";
		// console.info(index,item);
		var $trHtlm = $(Mustache.to_html(trTemplate, item));
		$('#contractsTbody').append($trHtlm);
		/*在每行下面增加合同事件信息  点击展示*/
		var contractData = sortEvents(item);
		var events = filterEvent(contractData);
		var trEvents = "<tr class='trEvent'><td colspan='8'><table id='eventTab' class='eventTab'></table></td></tr>";
		var $trHtlm1 = $(Mustache.to_html(trEvents, item));
		$('#contractsTbody').append($trHtlm1);
		initEvents(events, $trHtlm1);
		showEvents($trHtlm, $trHtlm1);
	});
}

/*对事件进行排序*/

function sortEvents(data) {
	var $events = data.events;
	for (var i = 0; i <= ($events).length - 1; i++) {
		for (var j = ($events).length - 1; j > i; j--) {
			if ($events[j].price > 0) {
				if ($events[j].invoiceDone == true) {
					$events[j].date = $events[j].priceDate;
				} else {
					$events[j].date = $events[j].invoiceDate;
				}
			}
			if ($events[j - 1].price > 0) {
				if ($events[j - 1].invoiceDone == true) {
					$events[j - 1].date = $events[j - 1].priceDate;
				} else {
					$events[j - 1].date = $events[j - 1].invoiceDate;
				}
			}
			if ($events[j].date < $events[j - 1].date) {
				var $tempEvent = $events[j];
				$events[j] = $events[j - 1];
				$events[j - 1] = $tempEvent;
			}
		}
	}
	return data;
}
/**抽取出事件中的当前事件，上一个已完成，下一个未完成事件  和当前事件
 *data为一个合同数据
 */

function filterEvent(data) {
	var events = data.events;
	if (events.length === 0) {
		return events;
	}
	var newEvents = new Array();
	var state = data.state;
	var sign = false;
	var i = 0;
	$.each(events, function(index, item) {
		if (state === item.title) {
			sign = true;
			i = index;
		}
	});
	if (!sign) {
		if (events.length === 1) {
			newEvents[0] = events[0];
		} else {
			newEvents[0] = events[0];
			newEvents[1] = events[1];
		}
	} else {
		if (i === (events.length - 1)) {
			newEvents[0] = events[i];
		} else if (i === (events.length - 2)) {
			newEvents[0] = events[i];
			newEvents[1] = events[i + 1];
		} else {
			newEvents[0] = events[i];
			newEvents[1] = events[i + 1];
			newEvents[2] = events[i + 2];
		}
	}
	return newEvents;
}

/*在每行下面增加合同事件信息  初始化事件数据*/
function initEvents(events, obj) {
	$.each(events, function(index1, item1) {
		var divClass = "";
		var agent = "";
		var dateName = "";
		var date = "";
		if (item1.completed) {
			divClass = "badge  badge-success";
		} else {
			divClass = "badge  badge-important";
		}
		//判断经办人和日期
		if (item1.price == -1) {
			agent = "{{customEve_person}}";
			dateName = "执行日期";
			date = "{{date}}";
		} else {
			if (item1.invoiceDone) {
				agent = "{{priceEve_person1}}";
				dateName = "回款日期";
				date = "{{priceDate}}";
			} else {
				agent = "{{priceEve_person2}}";
				dateName = "发票日期";
				date = "{{invoiceDate}}";
			}
		}
		var trEvent = "<tr><td class='tdFirst'><div class = '" + divClass + "' >" + (index1 + 1) + "</div></td><td class='eventTd1'><span>事件：</span>{{title}}</td><td class='eventTd2'><span>经办人:</span>" + agent + "</td><td class='eventTd3'><span>" + dateName + ":</span>" + date + "</td></tr>";
		var $tabHtml = $(Mustache.to_html(trEvent, item1));
		obj.find("#eventTab").append($tabHtml);
	});

}

//点击合同名，显示相关的事件信息（上一条完成和下一条未完成）
function showEvents(obj1, obj2) {
	obj1.find("#contract-title").click({
		obj: obj2
	}, function(e) {
		$(e.data.obj).slideToggle("fast");
	});
}

//定义取小数点后两位函数

function changeTwoDecimal(x) {
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
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
}

//点击排序，进行数据排序
$(".sortTd").click(function() {
	var sortClass = $(this).attr("class");
	//获取排序顺序和排序类型（根据什么字段排序）
	var _sortType = $(this).find("span").text().trim();
	switch (_sortType) {
		case "中标日期":
			{
				sortType = "beginDate";
				break;
			}
		case "金额":
			{
				sortType = "amount";
				break;
			}
		case "回款比率":
			{
				sortType = "ratio";
				break;
			}
	}
	//前台样式效果
	$.each($(".sortTd"), function(index, e) {
		switch (index) {
			case 0:
				{
					$(e).removeClass().addClass("hidden-480 center sortTd nouse1");
					break;
				}
			case 1:
				{
					$(e).removeClass().addClass("nouse center sortTd nouse1");
					break;
				}
			case 2:
				{
					$(e).removeClass().addClass("nouse center sortTd nouse1");
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

	if (sign === "initAll") {
		initAll();
	} else if (sign === "onSearch") {
		onSearch();
	} else if (sign === "onCustomSearch") {
		searchType = "onCustomSearch";
		onCustomSearch();
	}
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