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
			url: '/api/resource',
			type: 'POST',
			data: data,
			success: function(data) {
				console.info(data.operaCount);
				var page;
				if (data.operaCount < item) {
					page = 1;
				} else {
					page = Math.ceil(data.operaCount / item);
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
				initialize(data.operaData);

			},
			error: function(result) {
				console.info('error');
			}

		});
	};
	dataPage(1);

	var initialize = function(operations) {
		$('#operbody').html('');

		var template = "<tr><td class=center><span id=operName>{{name}}</span></td><td class=center><i id=editIcon class='icon-pencil bigger-150'></i>&nbsp;&nbsp;&nbsp;<i id='deleteIcon' class='icon-trash  bigger-150'></i></td></tr>";
		// var operations = data.operation;

		$.each(operations, function(i, operation) {

			var data = {
				name: operation.name
			};

			if (operation.name == "")
				return;

			var $html = $(Mustache.to_html(template, data));

			$('#operbody').append($html);

		});

		/*$.get('/api/resource', function(data, status) {
			if (status == 'success') {

				var operations = data.operation;

				$.each(operations, function(i, operation) {

					var data = {
						name: operation.name
					};

					if (operation.name == "")
						return;

					var $html = $(Mustache.to_html(template, data));
					
					$('#operbody').append($html);

				});
			}
		});*/
	};

	// initialize();
});