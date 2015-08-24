$(function() {
	//展开菜单
	$("ul[id='manage']").css('display', 'block');

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
				console.info(data);
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
		$('#resourceBody').html('');

		var template = "<tr><td class=center><span id=resName>{{name}}</span><input type=hidden id='id' value={{id}}></td><td class=center><span id=url>{{url}}</span></td><td class=center><i id=editIcon class='icon-pencil bigger-150'></i>&nbsp;&nbsp;&nbsp;<i id='deleteIcon' class='icon-trash  bigger-150'></i></td></tr>";
		if (rdata == "") {
			$('#tip').html("<div class='alert alert-warning' style='margin-top:-20px;'>没有相关信息</div>");
			return;
		} else {
			$('#tip').html("");
		}
		//获取资源名
		$.each(rdata, function(i, resource) {
			console.info("xuan-test");
			console.info(resource);
			var data = {
				name: resource.resource,
				url: resource.url,
				id: resource._id
			};

			var $html = $(Mustache.to_html(template, data));

			$('#resourceBody').append($html);

			//定义删除资源操作
			$html.find('#deleteIcon').click({
				html: $html
			}, function(e) {
				var $html = $(e.data.html);
				deleteRes($html);
			});

			//定义编辑资源操作
			$html.find('#editIcon').click({
				html: $html
			}, function(e) {
				var $html = $(e.data.html);
				var name = $html.find('#resName').html();
				var url = $html.find('#url').html();
				var id = $html.find('#id').val();

				var editData = {
					name: name,
					url: url,
					id: id
				};
				addResource(editData);
			});
		});

	}

	//新增加资源
	$('#resourcebtn').click(function() {
		addResource(null);
	});
	//添加或更新资源
	var addResource = function(resourceData) {

		$('#resourceAdd').modal('show');

		if (resourceData != null) {
			$("#title").html("编辑资源");
			$('#resourcename').val(resourceData.name);
			$('#resourceurl').val(resourceData.url);
		} else {
			$("#title").html("添加资源");
			$('#resourcename').val('');
			$('#resourceurl').val('');
		}


		$('#resourceAddSave').unbind('click');
		$('#resourceAddSave').bind('click', function() {
			var resource = $('#resourcename').val();
			var url = $('#resourceurl').val();
			var checkToReturn = false;
			if (resource == null || resource == undefined || resource == "") {
				bootbox.alert("资源名不能为空！");
				return;
			}
			if (url == null || url == undefined || url == "") {
				bootbox.alert("url不能为空！");
				return;
			}
			if (resourceData == null) {
				$.get('/api/resource', function(data, status) {
					if (status == 'success') {
						$.each(data, function(i, item) {
							if (resource == item.resource || url == item.url) {
								checkToReturn = true;
							}
						});
					}
					if (checkToReturn) {
						bootbox.alert("资源已存在，请重新输入!");
						return;
					}
				});
			}

			var ajaxurl = resourceData != null ? '/api/resource/' + resourceData.id : '/api/resource';
			var type = resourceData != null ? 'PUT' : 'POST';
			var data = resourceData != null ? {
				id: resourceData.id,
				resource: resource,
				url: url
			} : {
				resource: resource,
				url: url
			};

			console.info(ajaxurl);
			console.info(type);
			console.info(data);

			$.ajax({
				url: ajaxurl,
				type: type,
				data: data,
				success: function(result) {
					$('#resourceAdd').modal('hide');
					dataPage(1);
				},
				error: function(result) {
					$('#resourceAdd').modal('hide');

					if (resourceData != null)
						bootbox.alert('更新资源失败！');
					else
						bootbox.alert('添加资源失败！');
				}
			});
		});
	};

	//删除资源
	var deleteRes = function(html) {
		bootbox.confirm("确定删除吗？", function(result) {

			if (!result)
				return;

			var $html = $(html);

			var name = $html.find('#resName').html();
			var rurl = $html.find('#url').html();
			var rid = $html.find('#id').val();

			var delData = {
				id: rid,
				resource: name,
				url: rurl
			};

			$.ajax({
				url: '/api/resource/' + rid,
				type: 'DELETE',
				data: delData,
				success: function(result) {
					dataPage(1);
				},
				error: function(result) {
					bootbox.alert("删除资源失败！");
				}
			});

		});
	};
});