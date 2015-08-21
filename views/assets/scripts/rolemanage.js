$(function() {
	//展开菜单
	$("ul[id='manage']").css('display', 'block');

	$.ajaxSetup({
		async: false
	});

	var initialize = function() {

		$('#rbody').html('');

		// var temple = "<tr><td class=center><span id=rName>{{role}}</span><input type=hidden id='id' value={{id}}></td><td class=center><button id='priBtn' class='btn btn-warning btn-small'>授权</button></td><td class=center><i id=editIcon class='icon-pencil bigger-150'></i>&nbsp;&nbsp;&nbsp;<i id='deleteIcon' class='icon-trash  bigger-150'></i></td></tr>";
		var temple = "<tr><td class=center><span id=rName>{{role}}</span><input type=hidden id='id' value={{id}}></td><td class=center><button id='priBtn' class='btn btn-warning btn-small'>授权</button></td><td class=center><i id='deleteIcon' class='icon-trash  bigger-150'></i></td></tr>";


		//获取角色名
		$.get('/api/roles', function(data, status) {

			if (status == 'success') {
				$.each(data, function(i, role) {
					if (data == "") {
						$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>没有相关信息</div>");
						return;
					} else {
						$('#tip').html("");
					}

					var data = {
						role: role.role,
						id: role._id
					};

					var $html = $(Mustache.to_html(temple, data));

					$('#rbody').append($html);

					//定义删除角色操作
					$html.find('#deleteIcon').click({
						html: $html
					}, function(e) {

						var $html = $(e.data.html);
						deleteRole($html);

					});

					//定义编辑角色操作
					$html.find('#editIcon').click({
						html: $html
					}, function(e) {
						var $html = $(e.data.html);
						var rolename = $html.find('#rName').html();
						var id = $html.find('#id').val();

						var editData = {
							role: rolename,
							id: id
						};

						addRole(editData);
					});

					//定义授权操作
					$html.find('#priBtn').click({
						role: role
					}, function(e) {
						authorizeRole(e.data.role);
					});

				});
			}

		});
	}

	initialize();

	//新增加角色
	$('#rbtn').click(function() {
		addRole(null);
	});

	//添加或更新角色
	var addRole = function(roleData) {

		$('#roleAdd').modal('show');

		if (roleData != null) {
			$('#rolename').val(roleData.role);
		} else
			$('#rolename').val('');

		$('#roleAddSave').unbind('click');
		$('#roleAddSave').bind('click', function() {
			var rolename = $('#rolename').val();
			var checkToReturn = false;

			if (roleData == null) {
				$.get('/api/roles', function(data, status) {
					if (status == 'success') {
						$.each(data, function(i, role) {
							if (rolename == role.role) {
								checkToReturn = true;
							}
						});
					}
				});

				if (checkToReturn) {
					bootbox.alert("角色已存在，请重新输入!");
					return;
				}
			}

			//有时候添加新角色会出现角色名为“”，这bug还为找到，故先过滤下处理
			if (rolename == "")
				return;

			console.info(rolename);

			var url = roleData != null ? '/api/roles/' + roleData.id : '/api/roles';
			var type = roleData != null ? 'PUT' : 'POST';
			var data = roleData != null ? {
				id: roleData.id,
				role: rolename
			} : {
				role: rolename
			};

			console.info(url);
			console.info(type);
			console.info(data);

			$.ajax({
				url: url,
				type: type,
				data: data,
				success: function(result) {
					$('#roleAdd').modal('hide');
					initialize();
				},
				error: function(result) {
					$('#roleAdd').modal('hide');

					if (roleData != null)
						bootbox.alert('更新角色失败！');
					else
						bootbox.alert('添加角色失败！');
				}
			});
		});
	};

	//删除角色
	var deleteRole = function(html) {
		bootbox.confirm("确定删除吗？", function(result) {
			if (!result)
				return;

			var $html = $(html);
			var rolename = $html.find('#rName').html();
			var id = $html.find('#id').val();

			$.get('/api/roleusers/' + rolename, function(data, status) {
				if (status == 'success') {
					var delData = {
						role: rolename,
						id: id,
						data: data
					};
					console.info("success");
					console.info(data);
					if (data != null && data.length != 0) {
						bootbox.confirm("该角色已分配给用户，删除该角色会导致相关用户不能使用相关功能，确定删除吗？", function(result) {
							if (result) {
								console.info("delete");
								$.ajax({
									url: '/api/roles/' + id,
									type: 'DELETE',
									data: delData,
									success: function(result) {
										initialize();
									},
									error: function(result) {
										bootbox.alert("删除角色失败!");
									}
								});
							}
						})
					}

				}

			});

		});
	};

	$("#roleAuthCommit").click(function() {
		var role = $("#saveRole").val();
		// console.info("role = " + role);
		var checkData = checkRole(role);
		console.info("checkData = ");
		console.info(checkData);
		var resource = [];
		var $trHtmls = $('#authorizeBody').find('tr');
		$.each($trHtmls, function(i, trHtml) {

			var checked = $(trHtml).find('#choose').is(':checked');
			// console.info("第" + i + "行：checked ");
			// console.info(checked);

			if (checked) {
				var resName = $(trHtml).find('#resName').html();
				var url = $(trHtml).find('#url').val();

				// var $opers = $(trHtml).find('#oper');
				var $opers = $(trHtml).find("td[name='opera']")
				var operation = new Array();

				// console.info("opers = ");
				// console.info($opers);

				$.each($opers, function(j, oper) {
					var operChecked = $(oper).find(':checkbox').is(':checked');

					if (operChecked) {
						var hiddenInput = $(oper).find(':hidden').val();
						operation.push(hiddenInput);
					}
				});


				$.each(operation, function(i, operate) {
					var data = {
						opername: resName,
						oper: operate,
						resource: url
					};

					resource.push(data);
				});



			}
		});
		// if (checkData != null) {
		// 	for (var i in checkData) {
		// 		var index = 0;
		// 		for (var j in resource) {
		// 			if (resource[j] == checkData[i])
		// 				index++;
		// 		}

		// 		if (index == 0)
		// 			resource.push(checkData[i]);
		// 	}
		// }

		var postData = {
			role: role,
			resource: resource
		};
		console.info("======postData========");

		console.info(postData);

		var type = checkData != null ? 'PUT' : 'POST';
		console.info(type);

		$.ajax({
			url: '/api/roleresource',
			type: type,
			data: postData,
			async: false,
			success: function(result) {
				$('#roleAuthorize').modal('hide');
				bootbox.alert("角色授权成功!");
				initialize();
			},
			error: function(result) {
				$('#roleAuthorize').modal('hide');
				bootbox.alert("角色授权失败!");
				initialize();
			}
		});

	});

	//给角色授权
	var authorizeRole = function(role) {
		$("#saveRole").val(role.role);
		$('#roleAuthorize').modal('show');
		var checkData = checkRole(role.role);
		initializeAuth(checkData);

	};

	var initializeAuth = function(checkData) {
		$('#authorizeBody').html('');

		var template = "<tr><td class=center><input  id=choose type=checkbox><span class=lbl></span></td>" +
			"<td class=center><span id=resName>{{resource}}</span></td><input type=hidden id=url value={{url}}></td>" +
			"<td id=oper1 name = opera class=center><input type=checkbox><span class=lbl></span>{{oper1}}<input id=hioper  type=hidden value={{operation1}}></td>" +
			"<td id=oper2 name = opera class=center><input type=checkbox><span class=lbl></span>{{oper2}}<input id=hioper type=hidden value={{operation2}}></td>" +
			"<td id=oper3 name = opera class=center><input type=checkbox><span class=lbl></span>{{oper3}}<input id=hioper type=hidden value={{operation3}}></td>" +
			"<td id=oper4 name = opera class=center><input type=checkbox><span class=lbl></span>{{oper4}}<input id=hioper type=hidden value={{operation4}}></td></tr>";

		//拿到资源
		$.get('/api/resource', function(data, status) {

			if (status == 'success') {

				var resources = data.resource;
				var opers = data.operation;

				console.info("====data=====");
				console.info(data);

				$.each(data, function(i, resource) {

					if (resource.name == "")
						return;

					var templateData = {
						resource: resource.resource,
						url: resource.url,
						oper1: "增加",
						oper2: "查询/导出",
						oper3: "修改",
						oper4: "删除",
						operation1: 'post',
						operation2: 'get',
						operation3: 'put',
						operation4: 'delete'
					};

					var $html = $(Mustache.to_html(template, templateData));

					$('#authorizeBody').append($html);

				});
			}
		});

		if (checkData != null) {
			var $trHtmls = $('#authorizeBody').find('tr');
			$.each($trHtmls, function(i, trHtml) {
				// console.info(trHtml);

				var resName = $(trHtml).find('#resName').html();
				console.info("resName = " + resName);
				var url = $(trHtml).find('#url').val();
				var $opers = $(trHtml).find("td[name='opera']");

				$.each(checkData, function(k, data) {
					console.info(data.oper);
					if (data.opername == resName) {
						$(trHtml).find('#choose').attr("checked", true);
						$.each($opers, function(m, operation) {


							if ($(operation).find('#hioper').val() == data.oper) {
								$(operation).find(':checkbox').attr("checked", true);
							}
						})

					}
				});

			});

		}

	};

	//检查角色是否已授权
	var checkRole = function(checkRole) {
		var reData = null;
		$.get('/api/roleresource', function(data, status) {
			if (status == 'success') {

				$.each(data, function(i, role) {
					if (role.role == checkRole) {

						reData = role.resource;
						// console.info('inside');
						// console.info(reData);
					}
				});

			}
		});

		console.info(reData);
		return reData == [] ? null : reData;
	};

});