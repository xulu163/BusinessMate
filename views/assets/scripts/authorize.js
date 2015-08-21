$(function() {

	$('#item').change(function() {
		var item = $("#item  option:selected").text();
		console.info(item);
		dataPage(1);
	});

	var dataPage = function(cpage) {
		var item = $("#item option:selected").text();
		console.info("item=" + item);
		var data = {
			item: item,
			index: cpage
		};

		$.ajax({
			url: '/api/resource?item=' + item + '&index=' + cpage,
			type: 'GET',
			// data : data,
			success: function(data) {
				console.info(data.count);
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

	var initialize = function(rdata) {
		$('#authorizeBody').html('');
		$('#resource_role').html('');
		if (rdata == "") {
			$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>没有相关信息</div>");
			return;
		} else {
			$('#tip').html("");
		}

		var tempRole = "<option>{{role}}</option>";
		var template = "<tr><td class=center><input  id=choose type=checkbox><span class=lbl></span></td>" +
			"<td class=center><span id=resName>{{resource}}</span></td><td class=center><span id=url>{{url}}</span></td>" +
			"<td id=oper1 class=center><input type=checkbox><span class=lbl></span>{{oper1}}<input type=hidden value={{operation1}}></td>" +
			"<td id=oper2 class=center><input type=checkbox><span class=lbl></span>{{oper2}}<input type=hidden value={{operation2}}></td>" +
			"<td id=oper3 class=center><input type=checkbox><span class=lbl></span>{{oper3}}<input type=hidden value={{operation3}}></td>" +
			"<td id=oper4 class=center><input type=checkbox><span class=lbl></span>{{oper4}}<input type=hidden value={{operation4}}></td></tr>";

		//拿到角色
		$.get('/api/roles', function(data, status) {

			if (status == 'success') {
				$.each(data, function(i, role) {
					var roleData = {
						role: role.role
					};
					var $roleHtml = $(Mustache.to_html(tempRole, roleData));
					$('#resource_role').append($roleHtml);

				});
			}
		});

		$.each(rdata, function(i, resource) {

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
				operation3: 'update',
				operation4: 'del'
			};

			var $html = $(Mustache.to_html(template, templateData));

			$('#authorizeBody').append($html);

		});

	};

	$('#savaBtn').click(function() {

		var role = $('#resource_role').val();
		//首先获取该角色已有的操作权限
		var reData = null;
		$.get('/api/roleresource', function(data, status) {
			if (status == 'success') {

				$.each(data, function(i, item) {
					if (item.role == role) {
						reData = item.resource;
					}
				});

				var resource = [];

				var $trHtmls = $('#authorizeBody').find('tr');
				$.each($trHtmls, function(i, trHtml) {
					var checked = $(trHtml).find('#choose').is(':checked');

					if (checked) {
						var resName = $(trHtml).find('#resName').html();
						var url = $(trHtml).find('#url').html();

						var $opers1 = $(trHtml).find('#oper1');
						var $opers2 = $(trHtml).find('#oper2');
						var $opers3 = $(trHtml).find('#oper3');
						var $opers4 = $(trHtml).find('#oper4');
						var arrayOper = new Array();
						var operation = new Array();

						arrayOper.push($opers1);
						arrayOper.push($opers2);
						arrayOper.push($opers3);
						arrayOper.push($opers4);

						$.each(arrayOper, function(i, oper) {
							var checked = $(oper).find(':checkbox').is(':checked');

							if (checked) {
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

						if (reData != null) {
							for (var i in reData) {
								var index = 0;
								for (var j in resource) {
									if (resource[j] == reData[i])
										index++;
								}

								if (index == 0)
									resource.push(reData[i]);
							}
						}
					}
				});

				var postData = {
					role: role,
					resource: resource
				};

				var type = reData != null ? 'PUT' : 'POST';

				$.ajax({
					url: '/api/roleresource',
					type: type,
					data: postData,
					success: function(result) {
						bootbox.alert("角色授权成功!");
						releaseInput();
						// dataPage(1);
					},
					error: function(result) {
						bootbox.alert("角色授权失败!");
						releaseInput();
						// dataPage(1);
					}
				});

			}
		});
	});

	//释放input选中状态
	var releaseInput = function() {
		var $trHtmls = $('#authorizeBody').find('tr');
		$.each($trHtmls, function(i, trHtml) {
			var $inputs = $(trHtml).find('input');

			$.each($inputs, function(i, input) {
				if ($(input).is(':checked')) {
					$(input).attr('checked', false);
				}
			});
		});
	};
});