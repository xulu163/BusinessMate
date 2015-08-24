$(function() {
	//展开菜单
	$("ul[id='log']").css('display', 'block');

	$('#item').change(function() {
		var item = $("#item  option:selected").text();
		dataPage(1);
	});

	var dataPage = function(cpage) {
		var item = $("#item option:selected").text();

		$.ajax({
			url: '/api/operationlog?item=' + item + '&index=' + cpage,
			type: 'get',
			success: function(data) {
				if (!showPri(data)) {
					return;
				}
				console.info(data.count);
				var page;

				//若总共的合同数少于要求展示的条数，则1页展示
				if (data.count < item)
					page = 1;
				else
					page = Math.ceil(data.count / item);

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

		$('#operationlog1').html('');

		$.each(data, function(i, log) {
			var cname = log.data.name;
			var user = '';
			var realname = '';
			user = log.user;
			$.ajax({
				url: '/api/users/' + user,
				type: 'get',
				success: function(data) {
					console.info(data);
					realname = data[0].realname;
					//alert(realname);
					if (cname != undefined && cname.length > 14)
						cname = cname.substring(0, 13) + "..";
					var tdata = {
						time: log.time,
						user: realname,
						operation: log.operation,
						cname: cname,
						resource: log.resource,
						state: log.data.state
					};

					var template = "<tr><td class='center'>{{time}}</td><td class='center'>{{user}}</td><td class='center' title='" + log.data.name + "'>{{cname}}</td><td class='center'>{{operation}}</td><td class='center'>{{resource}}</td><td class='center'>{{state}}</td></tr>";
					var $templateHtml = $(Mustache.to_html(template, tdata));
					$templateHtml.click(function() {
						window.location.href = "/api/operationlog/" + log._id;
					});

					$("#operationlog1").append($templateHtml);
				}
			});
		});
	}

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

});