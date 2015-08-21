$(function(){
	//判断浏览器类型，不是谷歌和苹果浏览器就提示
  if (!(window.MessageEvent && !document.getBoxObjectFor) || !(window.openDatabase))
  	$('#tip').html("<br/><div class='alert alert-warning' style='margin-top:-20px;'>本系统对您使用的浏览器支持不是很好,请使用chrome或safari浏览器!  如未安装请点击下载安装：<a href='http://w.x.baidu.com/alading/anquan_soft_down_b/14744'>chrome</a>&nbsp;&nbsp;<a href='http://w.x.baidu.com/alading/anquan_soft_down_b/12966'>safari</a></div>");  
});
var show_box = function show_box(id) {
	$('.widget-box.visible').removeClass('visible');
	$('#' + id).addClass('visible');
};

$("#role1").click(function(){
	$("#role2").removeAttr("checked");
	$("#role1").attr("checked","checked");
});
$("#role2").click(function(){
	$("#role1").removeAttr("checked");
	$("#role2").attr("checked","checked");
});

$("#submitt").click(function(){
		var user = {};
		user.username = $("#loadUsername").val();
		user.password = $("#loadPassword").val();
		user.status = $("input[name='role'][checked]").val()
		$.ajax({
			url:"/users/session",
			type:"post",
			data: user,
			success:function(result){
				// console.info(result);
				if(result == "success") {
					window.location.href="/desktop";
				}else{
					window.location.href="/login";
				}
			}
		});
});

$('#loginForm').validate({
	errorElement: 'div',
	errorClass: 'errClass',
	focusInvalid: false,
	rules: {
		username: {
			required: true,
			minlength: 4,
			maxlength: 20,
		},
		password: {
			required: true,
		}
	},
	highlight: function(e) {
		console.info($(e).closest('.errClass'));
		$(e).closest('.errClass').removeClass('success').addClass('error');
	},

	success: function(e) {
		$(e).closest('.errClass').removeClass('error').addClass('success');
		$(e).remove();
	},

	errorPlacement: function(error, element) {
		error.appendTo(element.parent());
	},

	messages: {
		username: {
			required: "用户名不能为空.",
			minlength: "用户名长度小于4.",
		},
		password: {
			required: "密码不能为空.",
		}
	}
});

$("#registerForm").validate({
	rules: {
		email : {
			required: true,
		},
		username : {
			required: true,
			minlength: 3,
			remote: { 
				url: "/username", //url地址 
				type: "post", //发送方式 
				dataType: "json", //数据格式 
				data: { //要传递的数据 
						username: function() { 
						return $("#username").val(); 
					}
				}
			} 
		},
		password: {
			required: true,
			minlength: 5
		},
		password2: {
			required: true,
			minlength: 5,
			// equalTo: "#password"
		}
	},

	errorPlacement: function(error, element) {
		error.appendTo(element.parent());
	},

	messages: {
		email: "邮箱不能为空",
		username: {
			required: "用户名不能为空",
			minlength: "用户名长度小于3",
			remote: "用户已存在"
		},
		password: {
			required: "密码不能为空",
			minlength: "密码长度小于5"
		},
		password2: {
			required: "没有确认密码",
			minlength: "确认密码不能小于5个字符"
			// equalTo: "两次输入密码不一致"
		}
	}

});