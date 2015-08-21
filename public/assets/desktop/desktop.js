$(function() {
	// console.info("lijuanxia---desktop.js");

	// console.info("=======default.mustache====test==============");
	// console.info($("#exportExcel_fun"));
	// $("#exportExcel_fun").css('display','none');


	$("#desktop").css('display','block');
	$("#contracts").css('display','block');

	$.ajax({
		url: '/api/roleresource/desktop/sidenav',
		type: 'get',
		success: function(data){
			var urls = data.sendData
			// console.info(data);
			
			var fundShowFlag = 0;
			var logFlag = 0;
			var manageFlag = 0;
			var companyFlag = 0;

			$.each(urls, function(i, itemData) {
				var arry = itemData.split("/");
				// console.info(arry);
				if(arry.length == 2){
					var id = arry[1];
					// console.info($("#"+id));
					if($("#"+id).length != 0){
						$("#" + id).css('display','block');
					}
					//判断各主菜单下是否有子菜单，有为1，无为0
					if(id == 'fundPlan' || id == 'fund' || id == 'fundWait' || id == 'fundShould'){
						fundShowFlag = 1;
					}
					if(id == 'operationlogs'){
						logFlag = 1;
					}
					if(id == 'usermanage' || id == 'rolemanage' || id == 'resourcemanage' ){
						manageFlag = 1;
					}
					
				}else if(arry.length == 3){
					var id = arry[2];
					if($("#"+id).length != 0){
						$("#" + id).css('display','block');
					}
					if(id == 'partyA' || id == 'partyB' ){
						companyFlag = 1;
					}
				}

                //默认展开统计分析
				$("ul[id='fundShow']").css('display','block');

				
                //判断菜单下是否有子菜单，如果没有则隐藏该菜单
				if(fundShowFlag == 1){
					$("#fundShow").css('display','block');
				}else{
					$("#fundShow").css('display','none');
				}

				if(logFlag == 1){
				     $("#log").css('display','block');				
				}else{
					$("#log").css('display','none');
				}

				if(manageFlag == 1){
				     $("#manage").css('display','block');				
				}else{
					$("#manage").css('display','none');
				}

				if(companyFlag == 1){
				     $("#company").css('display','block');							
				}else{
					$("#company").css('display','none');
				}
				
			});
		}
	});


});