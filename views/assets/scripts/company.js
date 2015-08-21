 var cType = $('#cType').val();
 $(function() {

 	//展开菜单
 	$("ul[id='company']").css('display', 'block');

 	//显示菜单信息
 	var head = $("#breadcrumbs");
 	var headText = $("#breadcrumbs").text().trim();
 	console.info(cType);
 	if (headText == "首页") {
 		// console.info(head.html());
 		var detail = "";
 		if (cType == "partyA") {
 			detail = "甲方公司";
 		} else {
 			detail = "乙方公司";
 		}
 		head.html('<ul class="breadcrumb">' +
 			'<li><i class="icon-home"></i> <a href="/">首页</a><span class="divider"><i class="icon-angle-right"></i></span></li>' +
 			'<li><a href="#">公司信息管理</a> <span class="divider"><i class="icon-angle-right"></i></span></li>' +
 			'<li class="active">' + detail + '</li></ul>');
 	}

 	$.get('/api/company/' + cType, function(data, status) {
 		if (!showPri(data)) {
 			return;
 		}
 		$('#contractsTbody').html("");
 		//console.info("data"+data);
 		showList(data);
 	});
 });

 var showList = function(data) {
 	//console.log('data'+data);
 	if (data == "") {
 		$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>未能搜索到相关公司信息</div>");
 		return;
 	} else {
 		$('#tip').html("");
 	}

 	//判断data是单个元素还是多个元素，不然后面的遍历操作会将单个元素的对象所有属性遍历出来。
 	if (!isArray(data)) {
 		data = [data];
 	}

 	$('#contractsTbody').html("");
 	var checkId = "squaredOne";
 	$.each(data, function(index, item) {
 		var allowLen = 10;

 		item._cAddr = item.cAddr;
 		item._cFullName = item.cFullName;

 		if (item.cAddr.length > allowLen) {
 			item._cAddr = item.cAddr.substring(0, allowLen) + "...";
 		}
 		if (item.cFullName.length > allowLen) {
 			item._cFullName = item.cFullName.substring(0, allowLen) + "...";
 		}

 		var trTemplate = "<tr><td class='center'><label><input type='checkbox' name='check'><span class='lbl'></span></label><td style='display:none'>{{cid}}</td></td><td class='center hidden-480' title='{{cFullName}}'><input type='checkbox'/><a href='/company/edit/{{cid}}/" + cType + "'>{{_cFullName}}</a></td><td id='contract-title' class='center'>{{cAbbreviation}}</td><td class='center' title={{cAddr}}>{{_cAddr}}</td><td class='center'>{{cOffiWeb}}</td><td class='center row-date'>{{cTel}}</td><td class='center'>{{cEmail}}</td></tr>";
 		// console.info(index,item);
 		var $trHtlm = $(Mustache.to_html(trTemplate, item));
 		$('#contractsTbody').append($trHtlm);
 	});
 }

 $("#deleteCompanyBtn").click(deleteCompany);

 function deleteCompany() {
 	var checks = $("input[name='check']");
 	var cids = "";
 	if ($("input[name='check']:checked").length === 0) {
 		showAlert("请选择行！", "error", '3');
 		return false;
 	}
 	bootbox.confirm("确定删除?", function(result) {
 		if (!result) {
 			return;
 		}
 		$.each(checks, function(index, e) {
 			if ($(e).is(":checked")) {
 				var cid = $("#table_bug_report tr:eq(" + (index + 1) + ") td:eq(1)").text();;
 				cids = cids + "+" + cid;
 			}
 		});
 		cids = cids.substring(1, cids.length);
 		$.ajax({
 			url: '/api/company/' + cids,
 			type: 'DELETE',
 			success: function(data) {
 				$('table th input:checkbox')[0].checked = false;
 				showAlert("删除公司成功", "success", 3, doActionAfterSecond(function() {
 					/*待处理bug  ----后台删除成功后返回到 error这里……*/
 					$.get('/api/company/' + cType, function(data, status) {
 						$('#contractsTbody').html("");
 						//console.info("data"+data);
 						showList(data);
 					});
 					//因为是在本页面删除，删除成功后不重新刷新本页面，所以用js将删除的行隐藏
 				}, 0));
 			},
 			error: function(result) {
 				$('table th input:checkbox')[0].checked = false;
 				showAlert("删除公司失败", "error", 3, doActionAfterSecond(function() {
 					/*待处理bug  ----后台删除成功后返回到 error这里……*/
 					$.get('/api/company/' + cType, function(data, status) {
 						$('#contractsTbody').html("");
 						//console.info("data"+data);
 						showList(data);
 					});
 					//因为是在本页面删除，删除成功后不重新刷新本页面，所以用js将删除的行隐藏
 				}, 0));
 			}
 		});
 	});

 }
 var isArray = function(obj) {
 	return Object.prototype.toString.call(obj) === '[object Array]';
 }

 //初始化弹出框样式
 $._messengerDefaults = {
 	extraClasses: 'messenger-fixed messenger-theme-block messenger-on-bottom'
 };  //弹出底部提示框
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

 var doActionAfterSecond = function(func, delay) {
 	var t = setTimeout(function() {
 		func();
 		clearTimeout(t);
 	}, delay * 1000);
 }

 //checkId 全选与反选
 $('table th input:checkbox').on('click', function() {
 	var that = this;
 	$(this).closest('table').find('tr > td:first-child input:checkbox')
 		.each(function() {
 			this.checked = that.checked;
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