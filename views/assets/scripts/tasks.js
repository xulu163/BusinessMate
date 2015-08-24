$(function() {
	$.get("http://10.108.1.65:3000/tests", function(data, status) {

		$.each(data, function(i, contract) {

			var tdata = {
				name: contract.name,
				title: contract.next.title,
				date: contract.next.date
			};

			var template = "<ul class='item-list'><li class='item-orange'><label><input type='checkbox' id='checkbox'><span class='1b1'>{{name}} -> {{title}} : {{date}}</span></label></li></ul>";

			var html = Mustache.to_html(template, tdata);
			$('#taskToFinish').append(html);

			$('#checkbox').bind("click", function() {
				$('#checkbox').attr("checked", true);

			});

		})
	});
});