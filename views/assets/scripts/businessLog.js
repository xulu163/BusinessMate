$(function() {
	$.get('/api/businesslog', function(data, status) {
		$.each(data, function(i, log) {
			console.info("businesslog-log:");

			var cname = log.data.name;

			if (cname.length > 14)
				cname = cname.substring(0, 13) + "..";
			console.info(cname);
			var tdata = {
				time: log.time,
				cname: cname,
				version: log.getNew,
				deptA: log.data.partADept,
				deptB: log.data.partBDept,
				state: log.data.state
			};
			console.info(tdata.state);
			var template = "<div id='blog' class='span12'><div id='box' class='widget-box collapsed'><div class='widget-header widget-header-small'><h6><table><tr><th style=width:200px>{{time}}</th><th style=width:240px title=" + log.data.name + ">{{cname}}</th><th style=width:80px>版本:{{version}}</th><th style=width:60px>{{deptA}}</th><th style=width:60px>{{deptB}}</th><th style=width:220px>状态:{{state}}</th></tr></table></h6><div class='widget-toolbar'>[<a href='/contracts/" + log.contractId + "/" + log.getNew + "/log'>合同数据</a>]</div></div></div></div>";
			var $templateHtml = $(Mustache.to_html(template, tdata));

			$("#businesslog").append($templateHtml);

		});
	});
});