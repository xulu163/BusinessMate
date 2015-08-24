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
			"<li id='eventCell' class='widget-box'>" + "<div class='widget-header widget-header-flat widget-header-small'>" + "<div class='span6'>" + "<span id='number' class='badge '>{{number}}</span><span class='celltitle'>&nbsp;事件：</span>" + "<span class='celltitle'>开发票</span>" + "</div>" + "<div class='span3'><span class='celltitle'>经办人：</span>" + "<select name='priceEve_person1' id='priceEve_person1' class='span5'>" + $eveHtml + "</select></div>" + "<div class='widget-toolbar event-date'>" + "<span class='celltitle'>发票日期：</span>" + "<span><input class='hiddenInput2' id='invoiceDate{{dateID}}' data-date-format='yyyy-mm-dd' value='{{invoiceDate}}' readonly='true'></span>" + "<button id='billBtn' class='btn btn-mini bigger btn-yellow dropdown-toggle' data-toggle='dropdown'>操作<i class='icon-cog icon-on-right'></i></button>" + "<ul class='dropdown-menu dropdown-yellow pull-right dropdown-caret dropdown-close'>" + "<li id='markBillComplete'><a>标记已完成</a></li><li id='delete'><a>删除事件</a></li>" + "</ul></div>" + "</div>" + "<div class='widget-body'>" + "<div id='newBody' class='widget-main'>" + "<textarea id='remark' class='span12 cellremark' placeholder='请输入备注信息'>{{remark}}</textarea>" + "<input type='hidden' id='invoiceDone' value={{invoiceDone}}>" + "<input type='hidden' id='id' value='{{id}}'>" + "</div>" + "</div>" + "<div class='widget-header widget-header-flat widget-header-small'>"

		+ "<div class='span6'>" + "<span class='span1'></span><span class='celltitle'>事件：</span>" + "<span><input  id='title' class='hiddenInput' placeholder='' value='{{title}}'></span>" + "<span class='celltitle'>回款金额：</span>" + "<span><input id='price' class='hiddenInput2'  value='{{price}}'></span>" + "</div>" + "<div class='span3'><span class='celltitle'>经办人：</span>" + "<select name='priceEve_person2' id='priceEve_person2' class='span5'>" + $eveHtml + "</select></div>" + "<div class='widget-toolbar event-date'>" + "<span><span class='celltitle'>完成时间：</span>" + "<span><input id='date{{dateID}}'  class='hiddenInput2' data-date-format='yyyy-mm-dd' value='{{date}}' readonly='true'></span>"

		+ "<button id='priceBtn' class='btn btn-mini bigger btn-yellow dropdown-toggle' data-toggle='dropdown'>操作<i class='icon-cog icon-on-right'></i></button>" + "<ul class='dropdown-menu dropdown-yellow pull-right dropdown-caret dropdown-close'>" + "<li id='markcomplete'><a>标记已完成</a></li><li id='delete'><a>删除事件</a></li></ul>" + "</div>" + "</div>" + "<div class='widget-body'>" + "<div id='newBody' class='widget-main'>" + "<textarea id='remark' class='span12 cellremark' placeholder='请输入备注信息'>{{remark}}</textarea>" + "<input type='hidden' id='invoiceDone' value={{invoiceDone}}>" + "<input type='hidden' id='completed' value={{completed}}>" + "<input type='hidden' id='id' value='{{id}}'>" + "<input type='hidden' id='contractname' value='{{contractname}}'>" + "<input type='hidden' id='operation' value=''>" + "</div>" + "</div>" + "</li>";
	});

	$('#signPicker').datepicker({
		todayBtn: true,
		autoclose: true,
	});

	$('#signPicker').datepicker().on('changeDate', function(env) {
		$('#signPicker').datepicker('hide');
		$('#signPicker').blur()
	});

	$('#beginPicker').datepicker({
		todayBtn: true,
		autoclose: true,
	});

	$('#beginPicker').datepicker().on('changeDate', function(env) {
		$('#beginPicker').blur()
	});

	$('#endPicker').datepicker({
		todayBtn: true,
		autoclose: true,
	});

	$('#endPicker').datepicker().on('changeDate', function(env) {
		$('#endPicker').blur()
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
		},
		'onCancel': function(file) {
			for (var i = 0; i < uploadFilesInfo.length; i++) {
				if (file.name == uploadFilesInfo[i].name) {
					uploadFilesInfo.splice(i, i + 1);
				}
			}
		}
	});

	//甲乙方公司信息自动load
	$.get('/api/company/partyA', function(data, status) {
		$(data).each(function(index, item) {
			jcompany = item.cFullName + "";
			jAbbreviation = item.cAbbreviation + "";
			$("#partyA1").append("<option name='aa' value='" + jAbbreviation + "'>" + jcompany + "</option>");
		});
		if (data.length != 0) {
			$('#partyAabbr').val(data[0].cAbbreviation);
		}
		$("#partyA1").change(function() {
			document.getElementById('partyAabbr').value = document.getElementById('partyA1').value;
		});
	});

	$.get('/api/company/partyB', function(data, status) {
		$(data).each(function(index, item) {
			ycompany = item.cFullName + "";
			yAbbreviation = item.cAbbreviation + "";
			$("#partyB1").append("<option name='aa' value='" + yAbbreviation + "'>" + ycompany + "</option>");
		});
		if (data.length != 0) {
			$('#partyBabbr').val(data[0].cAbbreviation);
		}
		$("#partyB1").change(function() {
			document.getElementById('partyBabbr').value = document.getElementById('partyB1').value;
		});
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
						// $("#contract_person").append("<option value='" + item.username + "'>" + item.realname + "</option>");
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
						// $("#business_person").append("<option value='" + item.username + "'>" + item.realname + "</option>");
					}
					//动态加载销售负责人
					if (item.role == "salers") {
						$("#sals_person").append("<option value='" + item.username + "'>" + item.realname + "</option>");
					}

				});
			}
		});
	};

	initPerson();

	isTemplateMode = false;
	//初始化弹出框样式
	$._messengerDefaults = {
		extraClasses: 'messenger-fixed messenger-theme-block messenger-on-bottom'
	};

	var eventLen = 1;

	//添加自定义事件
	$("#customEventBtn").click(function() {
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

	var templateTmp = "<li><a hre='#' title='{{templateName}}'>{{templateName}}</a><i id='deleteTemp' class='icon-remove'></i></li>";

	$("#templateBtn").click(function() {
		$.get("/api/templates", function(data, status) {
			if (status == 'success') {

				var $templates = $(data);
				$("#templateList").html('');
				$templates.each(function(index, item) {
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
							addCustomEvent(item, 'template', index + 1);
						} else {
							addPriceEvent(item, 'template', index + 1);
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

						if (item)
							isTemplateMode = false;

						item.tName = result;
						item.amount = '';
						delete item._id;

						$.ajax({
							url: '/api/templates',
							type: 'POST',
							data: item,
							success: function(result) {
								showAlert("模板保存成功", "success", 2);
							},
							error: function(result) {
								showAlert("模板保存失败", "error", 2);
							}
						});
					}
				}
			});
		});
	});

	//保存按钮点击时
	$("#saveBtn").click(function() {
		// 对表单做出校验，校验通过则上传数据
		if ($('#validateForm').valid()) {
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
			$.ajax({
				url: '/api/contracts',
				type: 'POST',
				data: item,
				success: function(result) {
					//测试用校验代码
					if (result.error != null) {
						showAlert("创建合同失败", "error", 1);
						return;
					}
					if (result == "without privilege") {
						bootbox.alert("您没有权限执行该操作！");
						return;
					}

					showAlert("合同创建成功", "success", 2,
						doActionAfterSecond(function() {
							window.location.href = "/contracts";
						}, 1));
				},
				error: function(result) {
					showAlert("合同添加失败", "error", 2);
				}
			});
		} else {
			showAlert("合同数据有误，请确认后重新保存。", "error", 4);
			scrollToTop();
		}
	});

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
		//var $state 		= $("#state").val();

		var $contract_person = $("#contract_person option:selected").val(); //合同录入人
		var $sals_person = $("#sals_person option:selected").val(); //销售负责人
		var $business_person = $("#business_person option:selected").val(); //商务负责人
		var $contract_dept = $("#contract_dept option:selected").val(); //业绩归属部门
		var $contract_character = $("#contract_character option:selected").val(); //合同性质

		var model = {};
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
		//model.state 	= $state;

		model.contract_person = $contract_person;
		model.sals_person = $sals_person;
		model.business_person = $business_person;
		model.contract_dept = $contract_dept;
		model.contract_character = $contract_character;

		model.file = uploadFilesInfo;
		model.events = buildEventsModel();
		model.purchases = buildPurchaseModel(); //构建采购模型

		return model;
	}

	var buildEventsModel = function() {

		var $eventsArray = [];
		var $cellList = $("#eventsList").find(".widget-box");

		$cellList.each(function(index, element) {
			var $event = [];
			$cell = $(element);
			$event.id = generateID();
			$event.type = $cell.find("#price").val() == null ? 1 : 2; //判断事件类型
			$event.title = $cell.find("#title").val();
			$event.date = $cell.find("input[id^='date']").val();
			var tPrice = 0;
			if (isTemplateMode) {
				if ($event.type == 1)
					tPrice = -1;
				else
					tPrice = '';
			}
			$event.price = isTemplateMode ? tPrice : $cell.find("#price").val() == null ? -1 : $(element).find("#price").val();
			$event.remark = $cell.find("#remark").val();
			var $invoiceDate = $cell.find("input[id^='invoiceDate']").val();

			$event.customEve_person = $cell.find("#customEve_person option:selected").val(); //自定义事件经办人
			$event.priceEve_person1 = $cell.find("#priceEve_person1 option:selected").val(); //回款事件经办人（发票）
			$event.priceEve_person2 = $cell.find("#priceEve_person2 option:selected").val(); //回款事件经办人（事件）
			$event = {
				'id': $event.id,
				'type': $event.type,
				'title': $event.title,
				'date': $event.date,
				'price': $event.price,
				'remark': $event.remark,
				'completed': false,
				'customEve_person': $event.customEve_person,
				'priceEve_person1': $event.priceEve_person1,
				'priceEve_person2': $event.priceEve_person2
			};

			if ($event.type == 1) {

			} else {
				$event.invoiceDate = isTemplateMode ? '' : $invoiceDate;
				$event.date = isTemplateMode ? '' : $invoiceDate;
				$event.priceDate = isTemplateMode ? '' : $cell.find("input[id^='date']").val();
				$event.invoiceDone = false;
			};

			$eventsArray.push($event);
		});

		return $eventsArray;
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

	var addCustomEvent = function(data, type, index) {

		data = data == null ? [] : data;

		//消除事件列表空白的警告
		$("#blankWarn").hide();

		var datePickerID = generateID();

		var $cellHtml = $(Mustache.to_html(customEventTmp, {
			id: generateID(),
			number: index,
			title: data.title,
			date: data.date,
			price: data.price,
			remark: data.remark,
			dateID: datePickerID
		}));

		$cellHtml.find("#delete").click(function() {
			eventLen = eventLen - 1;
			//$cellHtml.animate({opacity: '0'});
			$cellHtml.slideUp();
			doActionAfterSecond(function() {
				$cellHtml.remove();
				var $cellList = $("#eventsList").find(".widget-box");
				if ($cellList.length == 0)
					$("#blankWarn").slideDown();
			}, 0.4);
		});

		$cellHtml.hide();
		$('#eventsList').append($cellHtml);
		$cellHtml.slideDown();

		$('#date' + datePickerID).datepicker({
			autoclose: true,
		});

	}

	var addPriceEvent = function(data, type, index) {

		data = data == null ? [] : data;

		//消除事件列表空白的警告
		$("#blankWarn").hide();
		var datePickerID = generateID();
		var $cellHtml = $(Mustache.to_html(priceEventTmp, {
			id: generateID(),
			title: data.title,
			number: index,
			date: data.priceDate,
			invoiceDate: data.invoiceDate,
			invoiceDone: false,
			price: data.price,
			remark: data.remark,
			dateID: datePickerID
		}));

		$cellHtml.find("#delete").click(function() {
			eventLen = eventLen - 1;
			$cellHtml.slideUp();
			doActionAfterSecond(function() {
				$cellHtml.remove();
				var $cellList = $("#eventsList").find(".widget-box");
				if ($cellList.length == 0)
					$("#blankWarn").slideDown();
			}, .4);
		});
		$cellHtml.hide();
		$('#eventsList').append($cellHtml);
		$cellHtml.slideDown();
		$('#date' + datePickerID).datepicker({
			autoclose: true,
		});
		$('#invoiceDate' + datePickerID).datepicker({
			autoclose: true,
		});
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
			partyB: {
				required: true,
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
			},
			state: {
				required: true,
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
				error.insertAfter(element.nextAll('[class*="chzn-container"]').eq(0));
			} else {
				error.insertAfter(element);
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
		$caigoudiv.append("<div class='widget-body widget-header-small'><div class='span5'><input  id='title' class='hiddenInput' placeholder=''></div><div class='span3 widget-toolbar'><input  id='title' class='hiddenInput' placeholder=''></div><div class='span3 widget-toolbar'><input  id='title' class='hiddenInput' placeholder=''></div><div class='span1 widget-toolbar'><button name='caigou_del' class='btn btn-mini bigger btn-info '>删除</button></div></div>");
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

	$("#caigou_del").click(function()  {         
		obj = this.parentNode.parentNode;
		bootbox.confirm("你确定要删除？", function(result) {
			if (result)
				obj.remove();
		});  
	});

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