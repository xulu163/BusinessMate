$(function() {
	//展开菜单
	$("ul[id='manage']").css('display', 'block');

	$.ajax({
		sync: true
	});
	$('#item').change(function() {
		var item = $("#item  option:selected").text();
		// console.info(item);
		dataPage(1);
	});

	var dataPage = function(cpage) {
		var item = $("#item option:selected").text();
		// console.info("item=" + item);
		var data = {
			item: item,
			index: cpage
		};
		$.ajax({
			url: '/api/paginator',
			type: 'POST',
			data: data,
			success: function(data) {
				// console.info(data);
				// console.info(data.count);
				var page;
				if (data.count < item) {
					page = 1;
				} else {
					page = Math.ceil(data.count / item);
				}

				var options = {
					currentPage: cpage,
					totalPages: page,
					alignment: 'right',
					onPageChanged: function(e, oldPage, newPage) {
						dataPage(newPage);
					}
				};

				$('#paginator').bootstrapPaginator(options);
				initialize(data.data);

			},
			error: function(result) {
				console.info('error');
			}

		});
	};
	dataPage(1);



	var initialize = function(data) {
		$('#ubody').html('');
		// console.info("userDatas");
		// console.info(data);
		$.each(data, function(i, user) {
			var urole = new Array();
			var tempRole = '';
			var $roleTempUsed;

			//拿到该用户对应的角色
			$.get('/api/userroles/' + user.uid, function(data, status) {

				//过滤掉用户没有分配意外没有分配角色的情况
				// if (data == undefined)
				// 	return;

				if (status == 'success') {
					if (data == "") {
						$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>没有相关信息</div>");
						return;
					} else {
						$('#tip').html("");
					}

					console.info("/api/userroles/");
					// console.info(data);
					if (data == "") {
						// console.info("kong");
						tempRole = "<td class=center></td>";
						var tempName = "<tr><td class=center><span id=uName>{{username}}</span><input type='hidden' id='userID' value={{uid}}><input type='hidden' id='realnameID' value={{realname}}><input type=hidden id=pwd value={{password}}><input type=hidden id=eMail value={{email}}></td>";
						var tempEdit = "<td class=center><i id=editIcon class='icon-pencil bigger-150'></i>&nbsp;&nbsp;&nbsp;<i id='deleteIcon' class='icon-trash  bigger-150'></i></td></tr>";

						var template = tempName + tempRole + tempEdit;
						var templateData = {
							realname: user.realname,
							username: user.username,
							password: user.password,
							email: user.email,
							uid: user.uid
						};

						var $html = $(Mustache.to_html(template, templateData));

						$('#ubody').append($html);

						//定义删除按钮删除事件
						$html.find('#deleteIcon').click({
							html: $html
						}, function(e) {
							var $html = $(e.data.html);

							deleteUser($html);

						});

						//定义编辑按钮编辑事件
						$html.find('#editIcon').click({
							html: $html
						}, function(e) {

							var $html = $(e.data.html);

							var $buttons = $html.find('button');
							var roles = new Array();

							$.each($buttons, function(i, button) {
								var role = $(button).html();
								roles.push(role);
							});

							var realname = $html.find('#realnameID').html();
							var username = $html.find('#uName').html();
							var uid = $html.find('#userID').val();
							var password = $html.find('#pwd').val();
							var email = $html.find('#eMail').val();

							var updateData = {
								realname: realname,
								username: username,
								uid: uid,
								password: password,
								email: email,
								role: roles,
								regin: user.regin
							};

							addUser(updateData);

						});
					}

					$.each(data, function(i, userrole) {
						$.each(userrole.role, function(i, roles) {

							tempRole += "<button class='btn disabled btn-warning btn-small'>" + roles + "</button>&nbsp;";
						});

						tempRole = "<td class=center>" + tempRole + "</td>";
						var tempName = "<tr><td class=center><span id=uName>{{username}}</span><input type='hidden' id='realnameID' value={{realname}}><input type='hidden' id='userID' value={{uid}}><input type=hidden id=pwd value={{password}}><input type=hidden id=eMail value={{email}}></td>";
						var tempEdit = "<td class=center><i id=editIcon class='icon-pencil bigger-150'></i>&nbsp;&nbsp;&nbsp;<i id='deleteIcon' class='icon-trash  bigger-150'></i></td></tr>";

						var template = tempName + tempRole + tempEdit;
						var templateData = {
							realname: user.realname,
							username: user.username,
							password: user.password,
							email: user.email,
							uid: user.uid
						};

						var $html = $(Mustache.to_html(template, templateData));

						$('#ubody').append($html);

						//定义删除按钮删除事件
						$html.find('#deleteIcon').click({
							html: $html
						}, function(e) {
							var $html = $(e.data.html);

							deleteUser($html);

						});

						//定义编辑按钮编辑事件
						$html.find('#editIcon').click({
							html: $html
						}, function(e) {

							var $html = $(e.data.html);

							var $buttons = $html.find('button');
							var roles = new Array();

							$.each($buttons, function(i, button) {
								var role = $(button).html();
								roles.push(role);
							});

							var realname = $html.find('#realnameID').val();
							var username = $html.find('#uName').html();
							var uid = $html.find('#userID').val();
							var password = $html.find('#pwd').val();
							var email = $html.find('#eMail').val();

							var updateData = {
								realname: realname,
								username: username,
								uid: uid,
								password: password,
								email: email,
								role: roles,
								regin: user.regin
							};

							addUser(updateData);

						});
					});

				}

			});

		});
	};

	//新增加用户
	$('#ubtn').click(function() {
		// console.info("test1");
		addUser(null);
	});

	//添加或更新用户
	var addUser = function(userData) {

		$('#userAdd').modal('show');
		$('#realname').val('');
		$('#uusername').val('');
		$('#password').val('');
		$('#email').val('');
		$("#roleTip").css('display', 'none');
		if (userData != null) {
			$("#title").html("编辑用户");
			$('#realname').val(userData.realname);
			$('#uusername').val(userData.username);
			$('#password').val(userData.password);
			$('#email').val(userData.email);

			for (var i = 0; i < $("#contract_dept option").length; i++) {
				if ($("#contract_dept ").get(0).options[i].text == userData.regin) {
					$("#contract_dept").get(0).options[i].selected = true;
					break;
				}
			}

		} else {
			$('#default').attr("selected", "selected");
			$("#title").html("添加用户");
		}

		addRolelist(userData);

		$('#userAddSave').unbind('click');
		$('#userAddSave').bind('click', function() {

			var username = $('#uusername').val();
			var realname = $('#realname').val();
			if (username == "") {
				$("#nameMessage").html('用户名不能为空！');
				$("#nameMessage").css('display', 'block');
				return;
			} else if (username.length < 4) {
				$("#nameMessage").html('用户名长度小于4！');
				$("#nameMessage").css('display', 'block');
				return;
			} else {
				$("#nameMessage").css('display', 'none');
			}



			var ppdata = {};
			var pwdChange = 0;
			if (userData != null) {
				if (userData.password != $('#password').val()) {
					pwdChange = 1;
				}
			}
			ppdata.realname = realname;
			ppdata.username = username;
			ppdata.password = $('#password').val();
			ppdata.password2 = $('#password').val();
			ppdata.pwdChange = pwdChange;
			ppdata.email = $('#email').val();
			ppdata.regin = $("#contract_dept option:selected").text() == "请选择" ? "" : $("#contract_dept option:selected").text(); //归属区域


			var type = userData != null ? 'PUT' : 'POST';

			if (userData != null)
				ppdata.uid = userData.uid;

			$.get('/api/users/' + username, function(data) {
				if ((data.length > 1) || (data.length == 1 && data[0].uid != ppdata.uid)) {
					console.info("uid", ppdata.uid);
					$("#nameMessage").html('用户名已存在！');
					$("#nameMessage").css('display', 'block');
					return;
				} else {
					if (realname == "") {
						$("#realnameMessage").html('真实名不能为空！');
						$("#realnameMessage").css('display', 'block');
						return;
					} else {
						$("#realnameMessage").css('display', 'none');
					}
					if ($('#password').val() == "") {
						$("#passwordMessage").html('密码不能为空！');
						$("#passwordMessage").css('display', 'block');
						return;
					} else {
						$("#passwordMessage").css('display', 'none');
					}

					if (ppdata.regin == "") {
						$("#contract_deptMessage").html('请选择所属区域！');
						$("#contract_deptMessage").css('display', 'block');
						return;
					} else {
						$("#contract_deptMessage").css('display', 'none');
					}
					$("#nameMessage").css('display', 'none');
					var $label = $('#roleU').find("label");
					var roles = new Array();
					var roleIndex = 0;
					//拿到选取的角色
					$.each($label, function(i, element) {
						var checked = $(element).find('input').is(':checked');

						if (checked) {
							var role = $(element).find('#roleGet').text();
							roles.push(role);
							roleIndex++;
						}

					});
					ppdata.role = roles;
					if (roleIndex == 0) {
						$("#roleTip").css('display', 'block');
						return;
					} else {
						saveOrUpdateUser(ppdata, type);
					}
				}
			});



		});

	};
	var saveOrUpdateUser = function(data, type) {
		$.ajax({
			url: '/api/users',
			type: type,
			data: data,
			success: function(result) {
				$('#userAdd').modal('hide');
				// $('#default').attr("selected","selected");
				if (type == "PUT") {
					bootbox.alert('更新用户成功！');
				} else {
					bootbox.alert('添加用户成功！');
				}
				dataPage(1);
			},
			error: function(result) {
				$('#userAdd').modal('hide');
				if (userData != null)
					bootbox.alert('更新用户失败！');
				else
					bootbox.alert('添加用户失败！');
			}
		});
	}

	$('#cancel').click(function() {
		$("#roleTip").css('display', 'none');
	});
	//增加用户时增加角色列表或更新角色列表
	var addRolelist = function(userData) {

		$('#roleU').html('');
		var template = "<label><input type=checkbox><span class=lbl></span><span id='roleGet'>{{role}}</span></label>&nbsp;&nbsp;&nbsp;";

		$.get('/api/roles', function(data, status) {

			if (status == 'success') {
				$.each(data, function(i, role) {
					var pdata = {
						role: role.role
					};

					var $html = $(Mustache.to_html(template, pdata));
					$('#roleU').append($html);

					if (userData != null) {
						$.each(userData.role, function(i, urole) {
							if (pdata.role == urole) {
								$html.find('input').attr("checked", true);
							}
						});
					}
				});
			}

		});
	};

	//删除用户
	var deleteUser = function(html) {
		bootbox.confirm("确定删除吗？", function(result) {

			if (!result)
				return;

			var $html = $(html);

			var $buttons = $html.find('button');
			var roles = new Array();

			$.each($buttons, function(i, button) {
				var role = $(button).html();
				roles.push(role);
			});

			var username = $html.find('#uName').html();
			var uid = $html.find('#userID').val();
			var delData = {
				username: username,
				uid: uid,
				role: roles
			};

			// console.info(delData);

			$.ajax({
				url: '/api/users',
				type: 'DELETE',
				data: delData,
				success: function(result) {
					dataPage(1);
				},
				error: function(result) {
					bootbox.alert("删除用户失败！");
				}
			});

		});
	};

});