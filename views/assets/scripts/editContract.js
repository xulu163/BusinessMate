$(function() {

	var customEventTmp;
	var priceEventTmp;
	var eveRoleArr = new Array();
	eveRoleArr.push('corpoBusinessManager');
	eveRoleArr.push('regionalBusinessManager');
	eveRoleArr.push('corpoBusinessAssistant');
	eveRoleArr.push('regionalAssistant');
	eveRoleArr.push('salers');

	var $eveHtml = '<option value="">--请选择--</option>';
	$.get('/api/roleusers/' + eveRoleArr, function(data, status) {
		$(data).each(function(index, item) {
			$eveHtml = $eveHtml + "<option value='" + item.username + "'>" + item.realname + "</option>";
		});
		customEventTmp =
			"<li id='eventCell' class='widget-box'>" + "<div class='widget-header widget-header-flat widget-header-small'>" + "<div class='span6'>" + "<span id='number' class='badge '>{{number}}</span><span class='celltitle'>&nbsp;事件：</span>" + "<span><input  id='title' class='hiddenInput' placeholder='' value='{{title}}'></span>" + "</div>" + "<div class='span3'><span class='celltitle'>经办人：</span>" + "<select name='customEve_person' id='customEve_person' class='span5'>" + $eveHtml + "</select></div>" + "<div class='widget-toolbar event-date'>" + "<span class='celltitle'>执行时间：</span>" + "<span><input id='date{{dateID}}' class='hiddenInput2' id='completedTime' data-date-format='yyyy-mm-dd' value='{{date}}' readonly='true'></span>" + "<button class='btn btn-mini bigger btn-yellow dropdown-toggle' data-toggle='dropdown'>操作<i class='icon-cog icon-on-right'></i></button>" + "<ul class='dropdown-menu dropdown-yellow pull-right dropdown-caret dropdown-close'>" + "<li id='markcomplete'><a>标记已完成</a></li><li id='delete'><a>删除事件</a></li>" + "</ul>" + "</div>" + "</div>" + "<div class='widget-body'>" + "<div id='newBody' class='widget-main'>" + "<textarea id='remark' class='span12 cellremark' placeholder='请输入备注信息'>{{remark}}</textarea>" + "<input type='hidden' id='completed' value={{completed}}><input type='hidden' id='id' value='{{id}}'>" + "<input type='hidden' id='contractname' value='{{contractname}}'>" + "<input type='hidden' id='operation' value=''>" + "</div>" + "</div>" + "</li>";
		priceEventTmp =
			"<li id='eventCell' class='widget-box'>" + "<div class='widget-header widget-header-flat widget-header-small'>" + "<div class='span6'>" + "<span id='number' class='badge '>{{number}}</span><span class='celltitle'>&nbsp;事件：</span>" + "<span class='celltitle'>开发票</span>" + "</div>" + "<div class='span3'><span class='celltitle'>经办人：</span><input type='hidden' id='person1Name' name='person1Name'/>" + "<select name='priceEve_person1' id='priceEve_person1' class='span5'>" + $eveHtml + "</select></div>" + "<div class='widget-toolbar event-date'>" + "<span class='celltitle'>发票日期：</span>" + "<span><input class='hiddenInput2' id='invoiceDate{{dateID}}' data-date-format='yyyy-mm-dd' value='{{invoiceDate}}' readonly='true'></span>" + "<button id='billBtn' class='btn btn-mini bigger btn-yellow dropdown-toggle' data-toggle='dropdown'>操作<i class='icon-cog icon-on-right'></i></button>" + "<ul class='dropdown-menu dropdown-yellow pull-right dropdown-caret dropdown-close'>" + "<li id='markBillComplete'><a>标记已完成</a></li><li id='delete'><a>删除事件</a></li>" + "</ul></div>" + "</div>" + "<div class='widget-body'>" + "<div id='newBody' class='widget-main'>" + "<textarea id='remark' class='span12 cellremark' placeholder='请输入备注信息'>{{remark}}</textarea>" + "<input type='hidden' id='invoiceDone' value={{invoiceDone}}>" + "<input type='hidden' id='id' value='{{id}}'>" + "</div>" + "</div>" + "<div class='widget-header widget-header-flat widget-header-small'>"

		+ "<div class='span6'>" + "<span class='span1'></span><span class='celltitle'>事件：</span>" + "<span><input  id='title' class='hiddenInput' placeholder='' value='{{title}}'></span>" + "<span class='celltitle'>回款金额：</span>" + "<span><input id='price' class='hidd'  value='{{price}}'></span>" + "</div>" + "<div class='span3'><span class='celltitle'>经办人：</span><input type='hidden' id='person2Name' name='person2Name'/>" + "<select name='priceEve_person2' id='priceEve_person2' class='span5'>" + $eveHtml + "</select></div>" + "<div class='widget-toolbar event-date'>" + "<span><span class='celltitle'>完成时间：</span>" + "<span><input id='date{{dateID}}'  class='hiddenInput3' data-date-format='yyyy-mm-dd' value='{{date}}' readonly='true'></span>"

		+ "<button id='priceBtn' class='btn btn-mini bigger btn-yellow dropdown-toggle' data-toggle='dropdown'>操作<i class='icon-cog icon-on-right'></i></button>" + "<ul class='dropdown-menu dropdown-yellow pull-right dropdown-caret dropdown-close'>" + "<li id='markcomplete'><a>标记已完成</a></li><li id='delete'><a>删除事件</a></li></ul>" + "</div>" + "</div>" + "<div class='widget-body'>" + "<div id='newBody' class='widget-main'>" + "<textarea id='remark' class='span12 cellremark' placeholder='请输入备注信息'>{{remark}}</textarea>" + "<input type='hidden' id='invoiceDone' value={{invoiceDone}}>" + "<input type='hidden' id='completed' value={{completed}}>" + "<input type='hidden' id='id' value='{{id}}'>" + "<input type='hidden' id='contractname' value='{{contractname}}'>" + "<input type='hidden' id='operation' value=''>" + "</div>" + "</div>" + "</li>";
	});

	//未修改的事件
	var conid = $("#contractID").val();
	var allEveArr = [];
	var iniEveArr = [];
	var $finalEveArr = [];
	var eveArr = [];
	$.get('/api/contracts/' + conid + '/query', function(data) {
		allEveArr = data[0].events;
	});
	$.get('/api/contracts/' + conid, function(data) {
		iniEveArr = data.events;
	});

	//----未修改的事件end

	var authority = function() {
		$.ajax({
			url: '/api/roleresource/desktop/sidenav', //获取用户所拥有的资源
			type: 'get',
			success: function(data) {
				var userResources = data.data;
				var delFlag = 0;
				var updateFlag = 0;
				var excelFlag = 0;

				$.each(userResources, function(i, itemData) {
					var oper = itemData.oper;
					var url = itemData.resource;
					if (url == "/api/contracts/:id") {
						if (oper == "delete") {
							delFlag = 1;
						} else if (oper == "put") {
							updateFlag = 1;
						}
					} else if (url == "/api/contracts/:id/excel") {
						if (oper == "get") {
							excelFlag = 1;
						}
					}

				});
				if (delFlag == 0) {
					$("#deleteContractBtn").css('display', 'none');
				}

				//编辑界面保存合同按钮、模版、增加事件
				if (updateFlag == 0) {
					$("#saveBtn").css('display', 'none');
					$("#saveAsTemplateBtn").css('display', 'none');
					$("#eventAddBtn").css('display', 'none');
					$("#templateBtn").css('display', 'none');
				}

				if (excelFlag == 0) {
					$("#exportExcel").css('display', 'none');
				}

			}
		});

	};

	//显示、隐藏合同事件列表
	$("#showEvents").click(function() {
		// console.info("showEvents");
		var obj = $("#events");
		if (obj.css("display") == 'none') {
			// obj.css("display") == '';
			$("#events").toggle();
			$("#showEvents").html("收起合同事件列表");
			// sortEventList();
		} else if (obj.css("display") == 'block') {
			// obj.css("display") = 'none';
			$("#events").toggle();
			$("#showEvents").html("显示合同事件列表");
		}
	});

	$("#exportExcel").click(function() {
		// console.info("exportExcel");
		var id = $("#contractID").val();
		// console.info("id:" + id);
		var url = "/api/contracts/" + id + "/excel";
		window.location = url;
	});

	var uploadFilesInfo = new Array();
	//上传控件代码
	$('#file_upload').uploadifive({
		'uploadScript': '/files/upload',
		'buttonClass': 'btn upload-btn',
		'buttonText': '添加附件',
		'auto': true,
		'fileSizeLimit': (1024 * 70),
		'onUploadComplete': function(file, data) {
			data = JSON.parse(data);
			uploadFilesInfo.push(data);
			// console.info(data);
		},
		'onCancel': function(file) {
			// console.info("remove", file.name);
			for (var i = 0; i < uploadFilesInfo.length; i++) {
				if (file.name == uploadFilesInfo[i].name) {
					uploadFilesInfo.splice(i, i + 1);
				}
			}
		}
	});

	var initPerson = function() {
		//合同录入人和具有编辑权限的用户关联
		var conRoleArr = new Array();
		conRoleArr.push('corpoBusinessManager');
		conRoleArr.push('regionalBusinessManager');
		conRoleArr.push('corpoBusinessAssistant');
		conRoleArr.push('regionalAssistant');
		conRoleArr.push('salers');
		$.ajax({
			url: '/api/roleusers/' + conRoleArr,
			type: 'get',
			success: function(data) {
				var conPersonList = [];
				$(data).each(function(index, item) {
					// console.info("item----",item);
					//动态加载合同录入人
					if (item.role == "corpoBusinessManager" || item.role == "regionalBusinessManager" || item.role == "corpoBusinessAssistant" || item.role == "regionalAssistant") {
						//去除重复的用户
						var flag = true;
						for (var i = 0; i < $("#contract_person option").length; i++) {
							if ($("#contract_person").get(0).options[i].value == item.username) {
								flag = false;
								break;
							}
						}
						if (flag) {
							$("#contract_person").append("<option value='" + item.username + "'>" + item.realname + "</option>");
						}
					}
					//动态加载商务负责人
					if (item.role == "regionalBusinessManager" || item.role == "corpoBusinessManager") {
						var flag2 = true;
						for (var i = 0; i < $("#business_person option").length; i++) {
							if ($("#business_person").get(0).options[i].value == item.username) {
								flag2 = false;
								break;
							}
						}
						if (flag2) {
							$("#business_person").append("<option value='" + item.username + "'>" + item.realname + "</option>");
						}
					}
					//动态加载销售负责人
					if (item.role == "salers") {
						$("#sals_person").append("<option value='" + item.username + "'>" + item.realname + "</option>");
					}

				});
				initialize();
			}
		});
	};

	//初始化弹出框样式
	$._messengerDefaults = {
		extraClasses: 'messenger-fixed messenger-theme-block messenger-on-bottom'
	};

	var isTemplateMode = false;
	var nextEvent;
	var versionID;
	var eventLen;

	var initialize = function() {
		var id = $("#contractID").val();
		var ids = $("#ids").val().split(",");

		var backId = '';
		var nextId = '';
		var btnHtml = '';

		for (var i = ids.length - 1; i >= 0; i--) {
			if (ids[i] == id) {
				if (i == 0) {
					nextId = ids[i + 1];
					break;
				} else if (i == ids.length - 1) {
					backId = ids[i - 1];
					break;
				} else {
					nextId = ids[i + 1];
					backId = ids[i - 1];
					break;
				}
			}
		};

		if (backId == '') {
			btnHtml = "<a id='nextBtn' class='btn  btn-success span6' href='/contracts/" + nextId + "/edit?ids=" + ids + "'>下一个合同</a>" + "<a id='returnBtn' class='btn  btn-success span6' href='javascript:history.go(-1)'>返回</a>";
		} else if (nextId == '') {
			btnHtml = "<a id='backBtn' class='btn  btn-success span6' href='/contracts/" + backId + "/edit?ids=" + ids + "'>上一个合同</a>" + "<a id='returnBtn' class='btn  btn-success span6' href='javascript:history.go(-1)'>返回</a>";
		} else {
			btnHtml = "<a id='backBtn' class='btn  btn-success span4' href='/contracts/" + backId + "/edit?ids=" + ids + "'>上一个合同</a>" + "<a id='nextBtn' class='btn  btn-success span4' href='/contracts/" + nextId + "/edit?ids=" + ids + "'>下一个合同</a>" + "<a id='returnBtn' class='btn  btn-success span4' href='javascript:history.go(-1)'>返回</a>";
		}
		$("#bottom-cmd-right").append(btnHtml);

		var url = !isLogMode() ? "/api/contracts/" + id : "/api/contracthistory/" + id + "/" + $("#version").val();


		$.get(url, function(data, status) {
			// console.info("1111111",data);
			if (status == 'success') {
				s = data.amount + "";
				data.amount = s.replace(/\B(?=(?:\d{3})+$)/g, ',');
				$("#myId").val(isLogMode() ? data.data.myId : data.myId);
				$("#name").val(isLogMode() ? data.contractName : data.name);
				$("#partyA1").val(isLogMode() ? data.data.partyA : data.partyA);
				$("#partyAabbr").val(isLogMode() ? data.data.partyAabbr : data.partyAabbr);
				$("#partyADept").val(isLogMode() ? data.data.partyADept : data.partyADept);
				$("#partyB1").val(isLogMode() ? data.data.partyB : data.partyB);
				$("#partyBabbr").val(isLogMode() ? data.data.partyBabbr : data.partyBabbr);
				$("#partyBDept").val(isLogMode() ? data.data.partyBDept : data.partyBDept);
				$("#signPicker").val(isLogMode() ? data.data.signDate : data.signDate);
				$("#beginPicker").val(isLogMode() ? data.data.beginDate : data.beginDate);
				$("#endPicker").val(isLogMode() ? data.data.endDate : data.endDate);
				$("#amount").val(isLogMode() ? data.data.amount : data.amount);

				//对尾款到账特殊处理，其勾选后状态显示为“合同结束”
				$("#state").val(isLogMode() ? data.data.state : data.state);

				console.info("$('#contract_person option').length:", $("#contract_person option").length);
				for (var i = 0; i < $("#contract_person option").length; i++) {
					if ($("#contract_person").get(0).options[i].value == data.contract_person) {
						$("#contract_person").get(0).options[i].selected = true;
						break;
					}
				}

				console.info("$('#sals_person option').length:", $("#sals_person option").length);
				for (var i = 0; i < $("#sals_person option").length; i++) {
					if ($("#sals_person").get(0).options[i].value == data.sals_person) {
						$("#sals_person").get(0).options[i].selected = true;
						break;
					}
				}

				console.info("$('#business_person option').length:", $("#business_person option").length);
				for (var i = 0; i < $("#business_person option").length; i++) {
					if ($("#business_person ").get(0).options[i].value == data.business_person) {
						$("#business_person").get(0).options[i].selected = true;
						break;
					}
				}
				for (var i = 0; i < $("#contract_dept option").length; i++) {
					if ($("#contract_dept ").get(0).options[i].value == data.contract_dept) {
						$("#contract_dept").get(0).options[i].selected = true;
						break;
					}
				}
				for (var i = 0; i < $("#contract_character option").length; i++) {
					if ($("#contract_character ").get(0).options[i].value == data.contract_character) {
						$("#contract_character").get(0).options[i].selected = true;
						break;
					}
				}

				// console.info("isLogMode---",isLogMode());
				var $events = $(isLogMode() ? data.data.events : data.events);
				// console.info("events---", $events);
				versionID = data._id;
				//对事件列表进行排序
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

				//设置ajax操作为异步，否则无法排序
				$.ajaxSetup({
					async: false
				});
				eventLen = $events.length;
				// alert(eventLen);
				$events.each(function(index, item) {
					if (item.price == -1) {
						addCustomEvent(item, null, index);
					} else {
						addPriceEvent(item, null, index);
					}
				});

				if (isLogMode()) {
					$("input").attr("readonly", "true");
					$("#deleteContractBtn").remove();
					$("#saveAsTemplateBtn").remove();
					$("#saveBtn").remove();
					$("#bottom-cmd-right").attr("class", "pull-right span2");
					$("#backBtn").attr("class", "btn span12");
					$("#backBtn").attr("href", "/contracts/" + id + "/edit");
					$("#add-event-btn-group").remove();
					$("#use-template-btn-group").remove();
					$("#tab-attachments").remove();
					$("#nextBtn").remove();
				}
				//对当前要执行的任务进行着色
				//highLightCurrentTask(id);

				//采购内容初始化
				var $purchase = $(data.purchases);
				$purchase.each(function(index, item) {
					var $caigoudiv = $("#caigou");
					$caigoudiv.append("<div class='widget-body widget-header-small'><div class='span5'><input  id='purchase_content' class='hiddenInput' value='" + item.content + "'></div><div class='span3 widget-toolbar'><input  id='purchase_price' class='hiddenInput' value='" + item.price + "'></div><div class='span3 widget-toolbar'><input  id='purchase_count' class='hiddenInput' value='" + item.count + "'></div><div class='span1 widget-toolbar'><button name='caigou_del' class='btn btn-mini bigger btn-info '>删除</button></div></div>");
				});

			} else {
				alert("拉取合同信息失败.");
			}
		});
	}

	//从服务器拉取数据并初始化网页数据
	initPerson();

	//初始化之后立即加上按钮权限
	authority();

	function highLightCurrentTask(id) {
		$.get('/api/contracts/' + id + '/tasks/business', function(data, status) {
			if (status == 'success') {
				$("input#id").each(function(index, item) {
					if (item.value == data.next.id) {
						$(item).parent().parent().parent().css("border", "2px solid rgba(0,0,255,.3)");
						return;
					}
				});
			}
		})
	}

	function sortEventList() {

		var $events = $(buildEventsModel());
		//对事件列表进行排序
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

		var $cellList = $("#eventsList");
		$cellList.html("");
		$events.each(function(index, item) {
			if (item.price == -1) {
				addCustomEvent(item, null, index);
			} else {
				addPriceEvent(item, null, index);
			}
		});

		scrollToBottom();
	}

	//添加自定义事件
	$("#customEventBtn").click(function() {
		// alert(eventLen);
		addCustomEvent(null, 'add', eventLen);
		eventLen = eventLen + 1;
		scrollToBottom();
	});
	// 添加回款事件
	$("#priceEventBtn").click(function() {
		addPriceEvent(null, 'add', eventLen);
		eventLen = eventLen + 1;
		scrollToBottom();
	});

	$("#tab-attachments").click(function() {
		$.ajax({
			url: '/files/show/' + getContractID(),
			type: 'GET',
			success: function(data) {

				$('.files').html("");

				$(data).each(function(index, item) {
					var tmp = "<li><span class='file-no'>[附件{{_no}}]:</span><a href='/files/download?contractId={{_cid}}&fileName={{_name}}'>{{_fileName}}</a><span class='file-size'>{{_size}}</span><i id='removeBtn' class='icon-remove'></i></li>";
					var $html = $(Mustache.to_html(tmp, {
						_no: index + 1,
						_cid: getContractID(),
						_fileName: item.name,
						_name: item.name,
						_size: item.size < 1024 ? parseInt(item.size) + "kb" : parseInt(item.size / 1024) + "mb"
					}));
					$html.find("#removeBtn").click(function() {

						bootbox.confirm("是否删除文件\"" + item.name + "\"", function(result) {

							if (result == false)
								return;
							$.ajax({
								url: '/files/destroy?contractId=' + getContractID() + '&fileName=' + item.name,
								type: 'DELETE',
								success: function() {
									$html.slideUp();
								}
							});
						});
					});
					$('.files').append($html);
				});
			},
			error: function(data) {
				showAlert("获取附件信息失败", "error", 2);
			}
		});
	});

	$("#tab-price").click(function() {

		$("#tab-content-price").html("");
		var $tmp = $('#eventsList').clone().find("li");
		// console.info("hello:",$tmp);
		$("#tab-content-price").append($tmp);

		$tmp.each(function(index, item) {
			//若无价格选项则为自定义事件
			var isCustom = $(item).find("#price").val() == undefined;
			$(item).find("input").attr("readonly", true);
			$(item).find("button").remove();
			// $(item).css("border", "");//注释掉就加上了红框

			if (isCustom) {
				$(item).remove();
			} else {
				console.info("lijuanxia---", $(item));
				var name1 = $(item).find("#person1Name").val();
				var name2 = $(item).find("#person2Name").val();
				for (var i = 0; i < $(item).find("#priceEve_person1 option").length; i++) {
					if ($(item).find("#priceEve_person1").get(0).options[i].value == name1) {
						$(item).find("#priceEve_person1").get(0).options[i].selected = true;
						break;
					}
				}
				for (var i = 0; i < $(item).find("#priceEve_person2 option").length; i++) {
					if ($(item).find("#priceEve_person2").get(0).options[i].value == name2) {
						$(item).find("#priceEve_person2").get(0).options[i].selected = true;
						break;
					}
				}
			}
		});
	});

	$("#tab-history").click(function() {
		$list = $("#tab-content-history").find("#histroy-list");
		$list.html("");

		$.get("/api/contracthistory/" + getContractID(), function(data, status) {
			$(data).each(function(index, item) {
				var temp = "<tr><td class='center span6'>{{date}}<input id='versionID' type='hidden' value='{{versionID}}'></td><td class='center span6'>{{version}}</td></tr>";
				var $html = $(Mustache.to_html(temp, {
					date: item.time,
					version: item.getNew,
					versionID: item._id
				}));

				//添加点击操作
				$html.click(function() {
					window.location.href = "/contracts/" + getContractID() + "/" + item.getNew + "/log";
				});

				$html.css("cursor", "pointer");
				$list.append($html);
			});
		});
	});

	var templateTmp = "<li><a hre='#' title='{{templateName}}'>{{templateName}}</a><i id='deleteTemp' class='icon-remove'></i></li>";

	$("#templateBtn").click(function() {

		$.get("/api/templates", function(data, status) {
			if (status == 'success') {

				var $templates = $(data);
				$("#templateList").html('');
				$templates.each(function(index, item) {
					if (item.tName.length > 25) {
						item.tName = item.tName.substring(0, 25) + "..";
					}

					var $cellHtml = $(Mustache.to_html(templateTmp, {
						templateName: item.tName
					}));

					$cellHtml.find("#deleteTemp").click(function() {
						$.ajax({
							type: 'DELETE',
							url: '/api/templates/' + item._id,
							success: function(result) {
								$cellHtml.remove();
							}
						});
					});

					$cellHtml.click(function() {
						loadTempalteAndRenderToHtml(item._id);
					});

					$("#templateList").append($cellHtml);
				});

				if ($('#templateList').text() == "") {
					var tmp = "<li><a hre='#' title='{{templateName}}'>{{templateName}}</a></li>";
					$('#templateList').append($(Mustache.to_html(tmp, {
						templateName: '当前无可用模板'
					})));
				}
			}
		});
	});

	var loadTempalteAndRenderToHtml = function(id) {
		$.get("/api/templates/" + id, function(data, status) {
			if (status == "success") {

				$("#myId").val(data.myId);
				$("#name").val(data.name);
				$("#partyA1").val(data.partyA);
				$("#partyAabbr").val(data.partyAabbr);
				$("#partyADept").val(data.partyADept);
				$("#partyB1").val(data.partyB);
				$("#partyBabbr").val(data.partyBabbr);
				$("#partyBDept").val(data.partyBDept);
				$("#signPicker").val(data.signDate);
				$("#beginPicker").val(data.beginDate);
				$("#endPicker").val(data.endDate);
				$("#amount").val(data.amount);
				$("#state").text("已中标");

				var $events = $(data.events);
				if ($events.length != null) {

					$("#eventsList").html("");

					$events.each(function(index, item) {
						if (item.price == -1) {
							addCustomEvent(item, 'template');
						} else {
							addPriceEvent(item, 'template');
						}
					});
				}

			} else {
				alert("获取模板失败！");
			}
		});
	}

	//点击保存模板按钮时
	$("#saveAsTemplateBtn").click(function() {
		saveAsTemplate();
	});

	var saveAsTemplate = function() {
		//模板保存时的弹出框
		bootbox.prompt("请填写模板名", function(result) {

			if (result === null)
				return;

			$.get("/api/templates", function(data, status) {
				if (status == 'success') {

					var $templates = $(data);
					var isExist = false;
					$templates.each(function(index, item) {
						if (item.tName == result) {

							showAlert("当前模板命名已存在，请重新命名!", "error", 3);

							isExist = true;
							return false;
						}
					});

					if (!isExist) {

						isTemplateMode = true; //标记当前创建model为模板模式
						var item = buildModel();
						isTemplateMode = false;
						item.tName = result;
						item.amount = '';
						delete item._id;

						$.ajax({
							url: '/api/templates',
							type: 'POST',
							data: item,
							success: function(result) {
								showAlert("模板保存成功", "success", 1);
							},
							error: function(result) {
								showAlert("模板保存失败", "error", 1);
							}
						});
					}
				}
			});
		});
	}

	//保存按钮点击时
	$("#saveBtn").click(function() {
		// 对表单做出校验，校验通过则上传数据
		if ($('#validateForm').valid()) {
			var $cellList = $("#eventsList").find(".widget-box");
			if (allEveArr.length != 0 && $cellList.length == 0) {
				bootbox.alert("网络故障,请稍后刷新重试！");
				return;
			}
			var item = buildModel();
			//判断回款总额是否大于合同金额
			var eventList = item.events;
			var eventPrice = 0;
			for (var i = 0; i < eventList.length; i++) {
				if (eventList[i].price != -1) {
					eventPrice = parseInt(eventPrice) + parseInt(eventList[i].price);
				}
			}

			if (eventPrice > item.amount) {
				bootbox.alert("回款总金额不能大于合同金额！");
				return;
			}

			if ($('#operation').val()) {
				$.get('/api/contracts/' + item._id + '/query', function(data, status) {
					$.ajax({
						url: '/api/contracts/' + getContractID(),
						type: 'PUT',
						data: data[0],
						success: function(result) {
							//测试用校验代码
							if (result.error != null) {
								showAlert("编辑合同失败", "err", 1);
								return;
							}

							$('#operation').val('');

							showAlert("合同修改成功", "success", 1,
								doActionAfterSecond(function() {
									window.location.href = "/contracts";
								}, 2));
						},
						error: function(result) {
							showAlert("编辑合同失败", "err", 1);
						}
					});

				});
			} else {
				$.ajax({
					url: '/api/contracts/' + getContractID(),
					type: 'PUT',
					data: item,
					success: function(result) {
						//测试用校验代码
						if (result.error != null) {
							showAlert("编辑合同失败", "err", 1);
							return;
						}

						showAlert("合同修改成功", "success", 1,
							doActionAfterSecond(function() {
								window.location.href = "/contracts";
							}, 2));
					},
					error: function(result) {
						showAlert("编辑合同失败", "err", 1);
					}
				});
			}

		} else {
			showAlert("合同数据有误，请确认后重新保存。", "error", 4);
			scrollToTop();
		}
	});

	$("#deleteContractBtn").click(deleteContract);

	function deleteContract() {

		var _url = isLogMode() ? "/api/contracthistory/" + getContractID() + "/" + versionID : "/api/contracts/" + getContractID();
		var message = isLogMode() ? "版本" : "合同";
		$.ajax({
			url: _url,
			type: 'DELETE',
			success: function(result) {
				showAlert("删除" + message + "成功", "success", 2, doActionAfterSecond(function() {
					window.location.href = "/contracts";
				}, 2));
			},
			error: function(result) {
				showAlert("删除" + message + "失败", "error", 2);
			}
		});
	}

	function markTaskCompleted(cell, data, seperate) {

		if (seperate == 1) {

			if ((!data.invoiceDone) && (data.invoiceDone != undefined)) {
				alert("发票事件未完成，请先完成发票事件！");
				return;
			}
		}

		var remark = '';
		var newDate = '';
		bootbox.prompt("请选择事件发票或事件完成的时间", "取消", "确定", function(result) {

			if (result === null)
				return;
			$model = buildOneEventModel(cell);
			newDate = $dataPicker.val();

			if (seperate == 0) {
				remark = cell.find("#billremark").val();
			} else if (seperate == 1) {
				console.info(data.invoiceDate > newDate);
				if (data.invoiceDate > newDate) {
					showAlert('回款时间不能比开发票时间早！', 'error', 3);
					return;
				}
				remark = cell.find("#priceremark").val();
			}

			var postData = {
				_id: getContractID(),
				id: data.id,
				name: cell.find('#contractname').val(),
				title: data.title,
				completed: true,
				remark: remark,
				newDate: newDate,
			};

			// console.info(postData);
			$.ajax({
				url: "/api/contracts/" + data.id + '/tasks',
				type: "put",
				data: postData,
				success: function(result) {
					// console.info("success");
					if (seperate == 0) {
						// $("#state").val(data.title+"开发票");
						cell.find("#completed").val(false);
						cell.find("#operation").val(true);
						cell.find(".hiddenInput2").val($dataPicker.val());
						cell.find("#invoiceDone").val('true');
						cell.find("#billBtn").remove();
					} else if (seperate == 1) {
						// $("#state").val(data.title);
						cell.find("#completed").val(true);
						cell.find("#operation").val(true);
						cell.find(".hiddenInput3").val($dataPicker.val());
						cell.find("button").remove();
						cell.css('border', '');
					} else {
						// $("#state").val(data.title);
						cell.find("#completed").val(true);
						cell.find("#operation").val(true);
						cell.find(".hiddenInput2").val($dataPicker.val());
						cell.find("button").remove();
						cell.css('border', '');
					}
					cell.find("#number").attr("class", 'badge badge-success');
				},
				error: function() {
					showAlert('无法使当前事件转为已完成状态', 'error', 1);
				}
			});

		}, getTodayString());

		var $dataPicker = $("div[class^='widget-boxx']").find("input");
		$dataPicker.attr('id', 'datetest');
		$dataPicker.removeClass("span12");
		$dataPicker.addClass('hidInput');
		$dataPicker.attr('data-date-format', 'yyyy-mm-dd');
		$dataPicker.attr('readonly', 'true');
		$dataPicker.removeAttr('autocomplete');
		$dataPicker.removeAttr('type');

		if (!data.invoiceDone && data.invoiceDone != undefined) {
			$dataPicker.val(data.invoiceDate);
		} else if (data.invoiceDone && !data.completed)
			$dataPicker.val(data.priceDate);
		else
			$dataPicker.val(data.date);

		$dataPicker.datepicker({
			autoclose: true
		});
		$dataPicker.datepicker().on('changeDate', function(env) {
			$dataPicker.datepicker('hide');
		});
	}

	var addCustomEvent = function(data, type, index) {
		var number = index + 1;
		// var number="NO."+index;
		data = data == null ? [] : data;
		//消除事件列表空白的警告
		$("#blankWarn").hide();

		var datePickerID = generateID();
		var contractId = getContractID();

		$.get('/api/contracts/' + contractId, function(tdata, status) {

			var $cellHtml = $(Mustache.to_html(customEventTmp, {
				id: type == 'add' ? generateID() : data.id,
				number: number,
				contractname: tdata.name,
				title: data.title,
				date: data.date,
				price: data.price,
				remark: data.remark,
				dateID: datePickerID,
				completed: type == 'add' ? false : data.completed
			}));
			for (var i = 0; i < $cellHtml.find("#customEve_person option").length; i++) {
				if ($cellHtml.find("#customEve_person").get(0).options[i].value == data.customEve_person) {
					$cellHtml.find("#customEve_person").get(0).options[i].selected = true;
					break;
				}
			}
			//删除事件按钮响应事件
			$cellHtml.find("#delete").click(function() {
				eventLen = eventLen - 1;
				$cellHtml.slideUp();
				doActionAfterSecond(function() {
					$cellHtml.remove();
					var $cellList = $("#eventsList").find(".widget-box");
					if ($cellList.length == 0)
						$("#blankWarn").slideDown();
				}, 0.4);
			});

			//完成事件按钮响应事件
			$cellHtml.find("#markcomplete").click(function() {
				markTaskCompleted($cellHtml, data, 2);
			});

			if (isLogMode()) {
				$cellHtml.find("button").remove();
			}
			//判断当前事件的完成程度基于颜色表示。绿色表示已经完成，红色表示当前执行的时间。

			if (data.length != 0) {
				// console.info(data.title, data.completed);
				if (stringToBoolean(data.completed)) {
					$cellHtml.find("button").remove(); //若事件已经完成，则不显示标识事件完成的按钮
					//$cellHtml.css('border','2px solid rgba(0,255,0,.2)');
					$cellHtml.find("#number").addClass(' badge-success');
				} else {
					// $cellHtml.css('border', '2px solid rgba(255,0,0,.4)');
					$cellHtml.find("#number").addClass(' badge-important');
				}
			}

			$cellHtml.hide();
			$('#eventsList').append($cellHtml);
			$cellHtml.slideDown();

			if (!isLogMode()) {
				$('#date' + datePickerID).datepicker({
					autoclose: true,
				});
				$('#date' + datePickerID).datepicker().on('changeDate', function(env) {
					$('#date' + datePickerID).datepicker('hide');
					//sortEventList();
				});
			}
		});
	}

	var addPriceEvent = function(data, type, index) {
		var number = index + 1;
		// var number="NO."+index;
		data = data == null ? [] : data;
		//消除事件列表空白的警告
		$("#blankWarn").hide();

		var datePickerID = generateID();
		var contractId = getContractID();

		$.get('/api/contracts/' + contractId, function(tdata, status) {
			var $cellHtml = $(Mustache.to_html(priceEventTmp, {
				id: type == 'add' ? generateID() : data.id,
				number: number,
				title: data.title,
				contractname: tdata.name,
				date: data.priceDate,
				price: data.price,
				remark: data.remark,
				dateID: datePickerID,
				invoiceDate: data.invoiceDate,
				invoiceDone: type == 'add' ? false : stringToBoolean(data.invoiceDone),
				completed: type == 'add' ? false : stringToBoolean(data.completed)
			}));
			for (var i = 0; i < $cellHtml.find("#priceEve_person1 option").length; i++) {
				if ($cellHtml.find("#priceEve_person1").get(0).options[i].value == data.priceEve_person1) {
					$cellHtml.find("#person1Name").val(data.priceEve_person1);
					$cellHtml.find("#priceEve_person1").get(0).options[i].selected = true;
					break;
				}
			}
			for (var i = 0; i < $cellHtml.find("#priceEve_person2 option").length; i++) {
				if ($cellHtml.find("#priceEve_person2").get(0).options[i].value == data.priceEve_person2) {
					$cellHtml.find("#person2Name").val(data.priceEve_person2);
					$cellHtml.find("#priceEve_person2").get(0).options[i].selected = true;
					break;
				}
			}
			//如果invoiceDone为true，则删除发票的操作按钮
			if (data.invoiceDone) {
				$cellHtml.find('#billBtn').remove();
			}

			$cellHtml.find("#delete").click(function() {
				eventLen = eventLen - 1;
				$cellHtml.slideUp();
				doActionAfterSecond(function() {
					$cellHtml.remove();
					var $cellList = $("#eventsList").find(".widget-box");
					if ($cellList.length == 0)
						$("#blankWarn").slideDown();
				}, 0.4);

			});

			//完成发票事件按钮响应事件
			$cellHtml.find("#markBillComplete").click(function() {
				markTaskCompleted($cellHtml, data, 0);
			});

			//完成回款事件按钮响应事件，因为完成发票事件后有些字段已改变，所以这里通过合同和事件id重新获得更新后的数据
			$cellHtml.find("#markcomplete").click(function() {
				var id = getContractID();
				var eventId = $cellHtml.find("#id").val();

				$.get('/api/contracts', function(data, status) {

					$.each(data, function(i, contract) {
						if (contract._id == id) {
							for (var j = 0; j < contract.events.length; j++) {
								if (contract.events[j].id == eventId) {

									var data = {
										"id": eventId,
										"title": contract.events[j].title,
										"date": contract.events[j].date,
										"price": contract.events[j].price,
										"copmleted": contract.events[j].completed,
										"invoiceDate": contract.events[j].invoiceDate,
										"priceDate": contract.events[j].priceDate,
										"invoiceDone": contract.events[j].invoiceDone,
										"_id": contract.events[j]._id
									};

									markTaskCompleted($cellHtml, data, 1);
								}
							}
						}
					});
				});
			});

			if (isLogMode()) {
				$cellHtml.find("button").remove();
			}
			//判断当前事件的完成程度基于颜色表示。绿色表示已经完成，红色表示当前执行的时间。

			if (data.length != 0) {
				// console.info(data.title, data.completed);
				if (stringToBoolean(data.completed)) {
					$cellHtml.find("button").remove(); //若事件已经完成，则不显示标识事件完成的按钮
					//$cellHtml.css('border','2px solid rgba(0,255,0,.2)');
					// $cellHtml.find("#number").css('background', '#7B9966');
					$cellHtml.find("#number").addClass(' badge-success');
				} else {
					// $cellHtml.css('border', '2px solid rgba(255,0,0,.4)');
					$cellHtml.find("#number").addClass(' badge-important');
				}
			}

			$cellHtml.hide();
			$('#eventsList').append($cellHtml);
			$cellHtml.slideDown();

			if (!isLogMode()) {
				$('#date' + datePickerID).datepicker({
					autoclose: true,
				});

				$('#invoiceDate' + datePickerID).datepicker({
					autoclose: true,
				});
				$('#invoiceDate' + datePickerID).datepicker().on('changeDate', function(env) {
					$('#invoiceDate' + datePickerID).datepicker('hide');
					//sortEventList();
				});
			}
		});
	}

	//获取页面上的数据，并构建一个合同模型
	var buildModel = function() {
		//从网页中提取已经输入的数据
		var $myId = $("#myId").val();
		var $name = isTemplateMode ? '' : $("#name").val();
		var $partyA = $("#partyA1").val();
		var $partyAabbr = $("#partyAabbr").val();
		var $partyADept = $("#partyADept").val();
		var $partyB = $("#partyB1").val();
		var $partyBabbr = $("#partyBabbr").val();
		var $partyBDept = $("#partyBDept").val();
		var $signDate = $("#signPicker").val();
		var $beginDate = $("#beginPicker").val();
		var $endDate = $("#endPicker").val();
		var $amount = isTemplateMode ? '' : $("#amount").val().replace(/,/g, "");
		var $state = $("#state").val();

		var $contract_person = $("#contract_person option:selected").val(); //合同经办人
		var $sals_person = $("#sals_person option:selected").val(); //销售负责人
		var $business_person = $("#business_person option:selected").val(); //商务负责人
		var $contract_dept = $("#contract_dept option:selected").val(); //业绩归属部门
		var $contract_character = $("#contract_character option:selected").val(); //合同性质
		// alert($contract_person);
		var model = {};
		model._id = getContractID();
		model.myId = $myId;
		model.name = $name;
		model.partyA = $partyA;
		model.partyAabbr = $partyAabbr;
		model.partyADept = $partyADept;
		model.partyB = $partyB;
		model.partyBabbr = $partyBabbr;
		model.partyBDept = $partyBDept;
		model.signDate = $signDate;
		model.beginDate = $beginDate;
		model.endDate = $endDate;
		model.amount = $amount;
		model.state = $state;
		model.file = uploadFilesInfo;
		model.events = buildEventsModel();
		model.purchases = buildPurchaseModel(); //构建采购模型
		model.contract_person = $contract_person;
		model.sals_person = $sals_person;
		model.business_person = $business_person;
		model.contract_dept = $contract_dept;
		model.contract_character = $contract_character;

		return model;
	}
	//构建合同的采购模型
	var buildPurchaseModel = function() {
		var $purchaseArray = [];
		var $cellList = $("#caigou").find(".widget-body");

		$cellList.each(function(index, element) {
			var $purchase = [];
			$cell = $(element);
			$purchase.pid = generateID();

			$purchase.content = $cell.find("#purchase_content").val(); //采购内容
			$purchase.price = $cell.find("#purchase_price").val(); //单价
			$purchase.count = $cell.find("#purchase_count").val(); //数量（人天）

			$purchase = {
				'pid': $purchase.pid,
				'content': $purchase.content,
				'price': $purchase.price,
				'count': $purchase.count,
			};
			$purchaseArray.push($purchase);
		});
		return $purchaseArray;
	}
	var buildEventsModel = function() {
		$finalEveArr = [];
		var $cellList = $("#eventsList").find(".widget-box");
		$cellList.each(function(index, element) {
			$finalEveArr.push(buildOneEventModel(element));
		});

		for (var i = 0; i < allEveArr.length; i++) {
			for (var k = 0; k < iniEveArr.length; k++) {
				if (allEveArr[i]._id == iniEveArr[k]._id) {
					allEveArr[i].id = "";
				}
			}
		}
		for (var i = 0; i < allEveArr.length; i++) {
			if (allEveArr[i].id != "") {
				$finalEveArr.push(allEveArr[i]);
			}
		}

		return $finalEveArr;
	}

		function buildOneEventModel(cell) {
			var $event = [];
			var $cell = $(cell);
			var $id = $cell.find("#id").val();
			var $title = $cell.find("#title").val();
			var $type = $cell.find("#price").val() == undefined ? 1 : 2; //判断事件类型
			var $date = $cell.find("input[id^='date']").val();
			// alert("www"+$date);
			var tPrice = 0;
			if (isTemplateMode) {
				if ($type == 1)
					tPrice = -1;
				else
					tPrice = '';
			}
			var $price = isTemplateMode ? tPrice : $cell.find("#price").val() == undefined ? -1 : $cell.find("#price").val();
			var $remark = $cell.find("#remark").val();
			var $completed = isTemplateMode ? false : stringToBoolean($cell.find("#completed").val());

			var $customEve_person = $cell.find("#customEve_person option:selected").val(); //自定义事件经办人
			var $priceEve_person1 = $cell.find("#priceEve_person1 option:selected").val(); //回款事件经办人（发票）
			var $priceEve_person2 = $cell.find("#priceEve_person2 option:selected").val(); //回款事件经办人（事件）

			var $invoiceDate = isTemplateMode ? '' : $cell.find("input[id^='invoiceDate']").val();
			var $invoiceDone = isTemplateMode ? false : $cell.find("#invoiceDone").val();
			var $priceDate = $cell.find("input[id^='date']").val();

			if ($type == 1) {} else {
				if ($invoiceDone == "true") {
					$date = $priceDate;
				} else {
					$date = $invoiceDate;
				}
			};
			$event = {
				'id': $id,
				'type': $type,
				'title': $title,
				'date': $date,
				'price': $price,
				'remark': $remark,
				'completed': $completed,
				'customEve_person': $customEve_person,
				'priceEve_person1': $priceEve_person1,
				'priceEve_person2': $priceEve_person2,
				'priceDate': $priceDate,
				'invoiceDate': $invoiceDate,
				'invoiceDone': $invoiceDone
			};

			return $event;
		}
	var getContractID = function() {
		return $("#contractID").val();
	}

	var scrollToBottom = function() {
		$('html, body, .container').animate({
			scrollTop: $(document).height()
		}, 600);
	}

	var scrollToTop = function() {
		$('html, body, .container').animate({
			scrollTop: 0
		}, 600);
	}

	var generateID = function() {

		//生成唯一ID号
		return new UUID().toString();
	}
	var doActionAfterSecond = function(func, delay) {
		var t = setTimeout(function() {
			func();
			clearTimeout(t);
		}, delay * 1000);
	}

	  //弹出底部提示框
	var showAlert = function(message, type, delay, callback) {
		$.globalMessenger().post({
			message: message,
			hideAfter: delay,
			type: type,
		});

		if (callback) {
			callback();
		}
	}

		function getTodayString() {
			var today = new Date();
			var mounth = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
			var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
			var todayFormat = today.getFullYear() + "-" + mounth + "-" + day;
			return todayFormat;
		}

		// 格式化金额  
		function formatmoney(value) {
			s = value;
			dh = /,/;
			while (dh.test(s)) {
				s = s.replace(dh, "");
			}
			if (isNaN(s)) {
				alert("您输入的可能不是数字");
				return false;
			}
			s = s.replace(/^(\d*)$/, "$1.");
			s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
			s = s.replace(".", ",");
			var re = /(\d)(\d{3},)/;
			while (re.test(s)) {
				s = s.replace(re, "$1,$2");
			}
			s = s.replace(/,(\d\d)$/, ".$1");
			return s.replace(/^\./, "0.");
		}

		//判断当前的编辑状态是从版本进入的还是直接编辑一份合同。
		function isLogMode() {
			return $("#version").val() == "" ? false : true;
		}

		function stringToBoolean(str) {

			if (str == true)
				return true;

			if (str == false)
				return false;

			return str == "true" ? true : false;
		}

	if (!isLogMode()) {
		$('#signPicker').datepicker({
			todayBtn: true,
			autoclose: true,
		});
		$('#signPicker').datepicker().on('changeDate', function(env) {
			$('#signPicker').datepicker('hide');
			$('#signPicker').blur();
		});

		$('#beginPicker').datepicker({
			todayBtn: true,
			autoclose: true,
		});
		$('#beginPicker').datepicker().on('changeDate', function(env) {
			$('#beginPicker').datepicker('hide');
			$('#beginPicker').blur();
		});

		$('#endPicker').datepicker({
			todayBtn: true,
			autoclose: true,
		});
		$('#endPicker').datepicker().on('changeDate', function(env) {
			$('#endPicker').datepicker('hide');
			$('#endPicker').blur();
		});

		$("#add-upload").click(function() {
			$(".file-list").css("display", "block");
			$("#uploadifive-file_upload").click();
		});
	}

	if (!isLogMode())
		$('#validateForm').validate({
			errorElement: 'span',
			errorClass: 'help-inline warn-tip',
			focusInvalid: false,
			rules: {
				myId: {
					required: true,
					minlength: 5,
					maxlength: 50,
				},
				name: {
					required: true,
				},
				partyA: {
					required: true,
				},
				partyADept: {
					required: false,
				},
				partyAabbr: {
					required: false,
				},
				partyB: {
					required: true,
				},
				partyBDept: {
					required: false,
				},
				partyBabbr: {
					required: false,
				},
				signPicker: {
					required: true,
					date: true,
				},
				beginPicker: {
					required: true,
					date: true,
				},
				endPicker: {
					required: true,
					date: true,
				},
				amount: {
					required: true,
					// digits: true,
				},
				state: {
					required: false,
				}
			},
			highlight: function(e) {
				$(e).closest('.control-group').removeClass('success').addClass('error');
			},

			success: function(e) {
				$(e).closest('.control-group').removeClass('error').addClass('success');
				$(e).remove();
			},

			errorPlacement: function(error, element) {
				if (element.is(':checkbox') || element.is(':radio')) {
					var controls = element.closest('.controls');
					if (controls.find(':checkbox,:radio').length > 1) controls.append(error);
					else error.insertAfter(element.nextAll('.lbl').eq(0));
				} else if (element.is('.chzn-select')) {
					// console.info(element);
					error.insertAfter(element.nextAll('[class*="chzn-container"]').eq(0));
				} else {
					error.insertAfter(element.parent());
				}
			},

			messages: {
				myId: {
					required: "合同编号不能为空.",
					minlength: "合同编号长度小于5."
				},
				name: {
					required: "合同名称不能为空.",
				},
				partyA: {
					required: "甲方信息不能为空.",
				},
				partyB: {
					required: "乙方信息不能为空.",
				},
				partyAabbr: {
					required: "甲方简称不能为空.",
				},
				partyBabbr: {
					required: "乙方简称不能为空.",
				},
				partyADept: {
					required: "甲方部门不能为空.",
				},
				partyBDept: {
					required: "乙方部门不能为空.",
				},
				signPicker: {
					required: "请选定具体日期.",
					date: "请选定具体日期."
				},
				beginPicker: {
					required: "请选定具体日期.",
					date: "请选定具体日期."
				},
				endPicker: {
					required: "请选定具体日期.",
					date: "请输入合同编号."
				},
				state: {
					required: "合同状态不能为空.",
				},
				amount: {
					required: "请输入合同总金额.",
					digits: "请输入正确的金额数."
				},
			},
		});

	///点击采购-增加按钮
	var i = 1;
	$("#caigou_add").click(function() {
		i = i + 1;
		var $caigoudiv = $("#caigou");
		$caigoudiv.append("<div class='widget-body widget-header-small'><div class='span5'><input  id='purchase_content' class='hiddenInput' placeholder=''></div><div class='span3 widget-toolbar'><input  id='purchase_price' class='hiddenInput' placeholder=''></div><div class='span3 widget-toolbar'><input  id='purchase_count' class='hiddenInput' placeholder=''></div><div class='span1 widget-toolbar'><button name='caigou_del' class='btn btn-mini bigger btn-info '>删除</button></div></div>");
		document.onclick = function() {
			var obj = event.srcElement;
			if (obj.name == "caigou_del") {
				obj = obj.parentNode.parentNode;
				bootbox.confirm("你确定要删除？", function(result) {
					if (result)
						obj.remove();
				}); 
			}
		}
	});

	document.onclick = function() {
		var obj = event.srcElement;
		if (obj.name == "caigou_del") {
			obj = obj.parentNode.parentNode;
			bootbox.confirm("你确定要删除？", function(result) {
				if (result)
					obj.remove();
			}); 
		}
	}
	//合同金额逗号隔开
	$("#amount").blur(function() {
		s = $("#amount").val();
		dh = /,/;
		while (dh.test(s)) {
			s = s.replace(dh, "");
		}
		if (isNaN(s)) {
			alert("您输入的可能不是数字");
			return false;
		}
		document.getElementById('amount').value = s.replace(/\B(?=(?:\d{3})+$)/g, ',');
	});
	$("#amount").click(function() {
		document.getElementById('amount').value = "";
	});
});