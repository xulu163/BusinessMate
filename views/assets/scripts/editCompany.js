var cType = $("#cType").val();
var cid = $("#cid").val();
$(function() {
	//从服务器拉取数据并初始化网页数据
	initialize();

	$('#validateForm').validate({
		errorElement: 'span',
		errorClass: 'help-inline warn-tip',
		focusInvalid: false,
		rules: {
			cFullName: {
				required: true,
			},
			cAbbreviation: {
				required: true,
			},
			cAddr: {
				required: true,
			},
			cOffiWeb: {
				required: true,
				url: true
			},
			cTel: {
				required: true,
			},
			cEmail: {
				required: true,
				email: true,
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
				console.info(element);
				error.insertAfter(element.nextAll('[class*="chzn-container"]').eq(0));
			} else {
				error.insertAfter(element);
			}
		},

		messages: {
			cFullName: {
				required: "公司全称不能为空.",
			},
			cAbbreviation: {
				required: "公司简称不能为空.",
			},
			cAddr: {
				required: "公司地址不能为空.",
			},
			cOffiWeb: {
				required: "公司官网不能为空",
				url: "网址格式不正确 http://……"
			},
			cTell: {
				required: "联系方式不能为空.",
			},
			cEmail: {
				required: "公司邮箱不能为空",
				email: "邮箱格式不正确",
			}
		},
	});
});

var initialize = function() {
	$.get('/api/company/' + cid + "/edit", function(data, status) {
		console.info(data);
		if (status == 'success') {
			//此处全是正常的输入，所以不用分情况,给表单赋初始值
			for (item in data[0]) {
				var em = $("#" + item);
				if (em) {
					$(em).val(data[0][item]);
				}

			}
		} else {
			alert("拉取合同信息失败.");
		}
	});
}

var uploadFilesInfo = new Array();
//上传控件代码
$('#file_upload').uploadifive({
	'uploadScript': '/files/upload',
	'buttonClass': 'btn upload-btn',
	'buttonText': '添加附件',
	'auto': true,
	'fileSizeLimit': (1024 * 5),
	'onUploadComplete': function(file, data) {
		data = JSON.parse(data);
		uploadFilesInfo.push(data);
		console.info(data);
	},
	'onCancel': function(file) {
		console.info("remove", file.name);
		for (var i = 0; i < uploadFilesInfo.length; i++) {
			if (file.name == uploadFilesInfo[i].name) {
				uploadFilesInfo.splice(i, i + 1);
			}
		}
	}
});

//保存按钮点击时
$("#saveBtn").click(function() {
	// 对表单做出校验，校验通过则上传数据
	if ($('#validateForm').valid()) {
		var item = buildModel();
		console.info(item);
		$.ajax({
			url: '/api/company',
			type: 'PUT',
			data: item,
			success: function(result) {

				//测试用校验代码
				if (result.error != null) {
					showAlert("编辑公司信息失败", "error", 1);
					return;
				}

				showAlert("编辑公司信息成功", "success", 2,
					doActionAfterSecond(function() {
						window.location.href = "/company/" + cType;
					}, 1));
			},
			error: function(result) {
				showAlert("编辑公司信息失败", "error", 2);
			}
		});
	} else {
		showAlert("公司信息数据有误，请确认后重新保存。", "error", 4);
		scrollToTop();
	}
});

//获取页面上的数据，并构建一个合同模型
var buildModel = function() {
	//从网页中提取已经输入的数据
	var $cid = cid;
	var $cType = $("#cType").val();
	var $cFullName = $("#cFullName").val();
	var $cAbbreviation = $("#cAbbreviation").val();
	var $cAddr = $("#cAddr").val();
	var $cOffiWeb = $("#cOffiWeb").val();
	var $cTel = $("#cTel").val();
	var $cEmail = $("#cEmail").val();
	//var $state 		= $("#state").val();
	var model = {};
	model.cid = $cid;
	model.cType = $cType;
	model.cFullName = $cFullName;
	model.cAbbreviation = $cAbbreviation;
	model.cAddr = $cAddr;
	model.cOffiWeb = $cOffiWeb;
	model.cTel = $cTel;
	model.cEmail = $cEmail;
	//model.state 	= $state;
	model.file = uploadFilesInfo;
	return model;
}

$("#tab-attachments").click(function() {
	$.ajax({
		url: '/files/show/company/' + cid,
		type: 'GET',
		success: function(data) {

			$('.files').html("");
			$(data).each(function(index, item) {
				var tmp = "<li><span class='file-no'>[附件{{_no}}]:</span><a href='/files/download?contractId={{_cid}}&fileName={{_name}}'>{{_fileName}}</a><span class='file-size'>{{_size}}</span><i id='removeBtn' class='icon-remove'></i></li>";
				var $html = $(Mustache.to_html(tmp, {
					_no: index + 1,
					_cid: cid,
					_fileName: item.name,
					_name: item.name,
					_size: item.size < 1024 ? parseInt(item.size) + "kb" : parseInt(item.size / 1024) + "mb"
				}));
				$html.find("#removeBtn").click(function() {

					bootbox.confirm("是否删除文件\"" + item.name + "\"", function(result) {

						if (result == false)
							return;
						$.ajax({
							url: '/files/destroy?contractId=' + cid + '&fileName=' + item.name,
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