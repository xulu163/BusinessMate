$(function() {
	var start = "";
	var end = "";
	var MyLoading = function(falg) {

		var loading1 = "<div id='dlading1' style='position:absolute;width:50%;height:50%;opacity:0.8;margin-top:55px;margin-left:80px;'>";
		loading1 += "<h6 style='display:inline;line-height:28px;height:28px;float:left'>正在加载，请等待......</h6></div>";

		var loading2 = "<div id='dlading2' style='position:absolute;width:50%;height:50%;opacity:0.8;margin-top:55px;margin-left:80px;'>";
		loading2 += "<h6 style='display:inline;line-height:28px;height:28px;float:left'>正在加载，请等待......</h6></div>";

		var loading3 = "<div id='dlading3' style='position:absolute;width:50%;height:50%;opacity:0.8;margin-top:65px;margin-left:260px;'>";
		loading3 += "<h6 style='display:inline;line-height:28px;height:28px;float:left'>正在加载，请等待......</h6></div>";

		if (falg) {
			$('#pholder1').append(loading1);
			$('#pholder2').append(loading2);
			$('#pholder3').append(loading3);

		}
	};

	var initialize = function() {
		MyLoading(true);

		var today = new Date();
		var mounth = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1);
		var day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
		var todayFormat = today.getFullYear() + "-" + mounth + "-" + day;
		var thisYearStart = today.getFullYear() + "-01-01";
		var thisYearEnd = today.getFullYear() + "-12-31";

		$('#beginDate').datepicker({
			autoclose: true,
			todayBtn: true,
		});
		$('#endDate').datepicker({
			autoclose: true,
			todayBtn: true,
		});

		$('#beginDate').val(thisYearStart);
		$('#endDate').val(thisYearEnd);

		start = $('#beginDate').val();
		end = $('#endDate').val();

		//载入业绩统计部分的图形
		loadingPie(thisYearStart, thisYearEnd);

		//载入代办任务部分
		loadingTask();
	};

	var loadingPie = function(start, end) {

		//定义取小数点后两位函数

		var changeTwoDecimal = function(x) {
			var f_x = parseFloat(x);
			if (isNaN(f_x))
				return false;
			var f_x = Math.round(x * 100) / 100;
			var s_x = f_x.toString();
			var pos_decimal = s_x.indexOf('.');
			if (pos_decimal < 0) {
				pos_decimal = s_x.length;
				s_x += '.';
			}
			while (s_x.length <= pos_decimal + 2) {
				s_x += '0';
			}
			return s_x;
		};

		//字符串转换成十六进制

		var stringToHex = function(str) {
			var val = "";
			for (var i in str) {
				if (val == "")
					val = str.charCodeAt(i).toString(16);
				else
					val += "," + str.charCodeAt(i).toString(16);
			}
			return val;
		};

		//数组去重
		Array.prototype.unique = function() {
			this.sort();
			var re = [this[0]];
			for (var i = 1; i < this.length; i++) {
				if (this[i] !== re[re.length - 1]) {
					re.push(this[i]);
				}
			}
			return re;
		};

		var color = new Array("#68BC31", "#FEE074", "#d54c7e", "#2091CF", "#AF4E96", "#b74635", "#DA5430", "#f7d05b", "#8b9aa3", "#4f99c6", "#69aa46", "#d9d9d9", "#a069c3", "#629b58", "#b4c2cc");

		//计算各航空的合同数目
		var partyAabbr = new Array(),
			partyBabbr = new Array();
		var contractsCount = 0, //初始合同计数
			tempCount = 0; //搜索计数
		var isChecked = false;

		//定义三种回款标识
		var allCount, allUncount, waitCount;

		//获取三种回款的值
		$.get("/api/contracts/tasks/graph/" + start + "/" + end, function(data, status) {

			// 金钱逗号隔开显示
			allCount = data.allReturnCount;
			s1 = allCount + "";
			allCount = s1.replace(/\B(?=(?:\d{3})+$)/g, ',');
			allUncount = data.allUnreturnCount;
			s2 = allUncount + "";
			allUncount = s2.replace(/\B(?=(?:\d{3})+$)/g, ',');
			waitCount = data.allWaitCount;
			s3 = waitCount + "";
			waitCount = s3.replace(/\B(?=(?:\d{3})+$)/g, ',');

			//桌面饼图部分
			$.get("/api/contract", function(data, status) {

				//合同款饼图
				$.get("/api/contracts/tasks/graph/" + start + "/" + end, function(data, status) {
					var pieData3 = [];
					var data1 = {
						label: "已回款",
						data: data.allReturnCount,
						color: "#f89406"
					};
					var data2 = {
						label: "待回款",
						data: data.allWaitCount,
						color: "#b74635"
					};
					var data3 = {
						label: "应收款",
						data: data.allUnreturnCount,
						color: "#005580"
					};
					pieData3.push(data1);
					pieData3.push(data2);
					pieData3.push(data3);
					var placeholder3 = $('#placeholder1').css({
						'width': '100%',
						'min-height': '160px'
					});
					$("#dlading1").remove();
					$.plot(placeholder3, pieData3, optionPie);
					placeholder3.bind("plotclick", function(event, pos, obj) {
						var labelName = obj.series.label;

						if (labelName == "已回款")
							window.location.href = "/fund/" + start + "/" + end;
						else if (labelName == "应收款")
							window.location.href = "/fundShould/" + start + "/" + end;
						else
							window.location.href = "/fundWait/" + start + "/" + end;
					});
				});

				//设置饼图标签格式，同时返回金额和百分比

				$.each(data, function(i, contract) {
					if (start != 0) {

						if ((contract.beginDate >= start) && (contract.beginDate <= end)) {
							partyAabbr[tempCount] = contract.partyAabbr;
							partyBabbr[tempCount] = contract.partyBabbr;
							tempCount++;
						}
					} else {
						partyAabbr[contractsCount] = contract.partyAabbr;
						partyBabbr[contractsCount] = contract.partyBabbr;
						contractsCount++;
					}
				});

				//数组去重
				partyAabbr = partyAabbr.unique();
				partyBabbr = partyBabbr.unique();

				var optionPie = {
					series: {
						pie: {
							show: true,
							radius: 1,
							highlight: {
								opacity: 0.3
							},
							label: {
								show: true,
								radius: 1 / 2,
								formatter: labelFormatter,
								background: {
									opacity: 0
								}
							}
						}
					},
					legend: {
						show: true,
						position: "ne",
						labelBoxBorderColor: null,
						margin: [10, -4]
					},
					grid: {
						hoverable: true,
						clickable: true
					}
				};

				function labelFormatter(label, series) {
					var count = 0;
					if (label == "已回款")
						return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>￥" + allCount + "<br/>" + changeTwoDecimal(series.percent) + "%</div>";
					else if (label == "应收款")
						return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>￥" + allUncount + "<br/>" + changeTwoDecimal(series.percent) + "%</div>";
					else if (label == "待回款")
						return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>￥" + waitCount + "<br/>" + changeTwoDecimal(series.percent) + "%</div>";
					else {
						$.each(data, function(i, contract) {
							if (start != 0) {
								if (contract.beginDate >= start && contract.beginDate <= end) {
									if (contract.partyAabbr == label || contract.partyBabbr == label)
										count += contract.amount;
								}
							} else {
								if (contract.partyAabbr == label || contract.partyBabbr == label)
									count += contract.amount;
							}
						});
						//金额逗号隔开显示
						s = count + "";
						count = s.replace(/\B(?=(?:\d{3})+$)/g, ',');
						return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>￥" + count + "<br/>" + changeTwoDecimal(series.percent) + "%</div>";
					}
				}

				var pieData1 = new Array(),
					pieData2 = new Array();

				//获得甲（乙）方各公司的总金额，并存入饼图数据中
				for (var i = 0; i < partyAabbr.length; i++) {
					var amountA = 0; //甲方总金额
					var toPushA = false;
					$.each(data, function(t, contract) {

						if (contract.partyAabbr == partyAabbr[i]) {
							if (contract.beginDate >= start && contract.beginDate <= end) {
								amountA += contract.amount;
							}
							// amountA += contract.amount;
							toPushA = true;
						}
					});

					if (toPushA) {
						pieData1.push({
							label: partyAabbr[i],
							data: amountA
						});
					}
				}

				for (var i = 0; i < partyBabbr.length; i++) {
					var amountB = 0;
					var toPushB = false;
					$.each(data, function(s, contract) {

						if (contract.partyBabbr == partyBabbr[i]) {
							if (contract.beginDate >= start && contract.beginDate <= end) {
								amountB += contract.amount;
							}

						}
						if (s == (data.length - 1))
							toPushB = true;
					});

					if (toPushB) {
						pieData2.push({
							label: partyBabbr[i],
							data: amountB,
							color: color[i + 3]
						});
					}
				}

				//柱状图
				var data3 = [];
				var data4 = [];
				var series = [];
				var tempData = [];
				var countAll = 0;

				for (var i = 0; i < pieData1.length; i++) {
					// alert(pieData1[i].data);
					countAll += pieData1[i].data;
				}

				//给柱状图按比例排序
				var pieTemp3 = new Array();
				var seriesTemp3 = new Array();

				for (var i = 0; i < pieData1.length; i++) {
					pieTemp3[i] = pieData1[i].data;
					seriesTemp3[i] = pieData1[i].label;
				}

				for (var i = 0; i < pieTemp3.length - 1; i++) {
					for (var j = i + 1; j < pieTemp3.length; j++) {
						var temp;
						var tempS;
						if (pieTemp3[i] > pieTemp3[j]) {
							temp = pieTemp3[i];
							pieTemp3[i] = pieTemp3[j];
							pieTemp3[j] = temp;

							tempS = seriesTemp3[i];
							seriesTemp3[i] = seriesTemp3[j];
							seriesTemp3[j] = tempS;
						}
					}
				}

				for (var i = 0; i < pieTemp3.length; i++) {
					var test = pieTemp3[i];
					var temp = [test];
					var templabel = seriesTemp3[i];

					data3.push(temp);
					data4.push(test);
					tempData.push(test / 10000);
					series.push({
						'label': templabel
					});
				}
				$("#dlading3").remove(); //每次载入图形之前先去掉加载提示
				var line1 = [tempData];
				var line1display = new Array();
				for (var i = 0; i < data4.length; i++) {
					var s = data4[i] + "";
					s = "￥" + s.replace(/\B(?=(?:\d{3})+$)/g, ',');
					line1display.push(s);
				}

				var ticks = seriesTemp3;
				var labels = seriesTemp3;
				var max = data4[data4.length - 1] + data4[data4.length - 1] / 7;
				$('#placeholder3').jqplot(line1, {
					// Provide a custom seriesColors array to override the default colors.
					seriesColors: color,
					seriesDefaults: {
						renderer: $.jqplot.BarRenderer,
						 pointLabels: {
							show: true,
							location: 'e',
							edgeTolerance: -15
						},
						rendererOptions: {
							// Set varyBarColor to tru to use the custom colors on the bars.
							barDirection: 'horizontal',
							barWidth: 18,
							barPadding: 5,
							varyBarColor: true
						}
					},
					series: [{
						pointLabels: {
							show: true,
							labels: line1display
						}
					}],

					axes: {
						xaxis: {
							autoscale: true,
							show: true, // 是否自动显示坐标轴
							min: 0,
							// max: max // 横(纵)轴最大刻度值
							pad: 1.3,
							tickRenderer: $.jqplot.CanvasAxisTickRenderer,

							tickOptions: {
								angle: -20,
								fontSize: '12px',
								formatString: '￥%d' + '万'
							}
						},
						yaxis: {
							ticks: ticks,
							renderer: $.jqplot.CategoryAxisRenderer
						}
					}
				});

				$('#placeholder3').bind('jqplotDataClick',
					function(ev, seriesIndex, pointIndex, data) {
						var labelName = series[pointIndex].label;
						window.location.href = "/desktop" + '/' + stringToHex(labelName) + '/' + start + '/' + end + '/1'; //甲方公司
					}
				);

				var placeholder2 = $('#placeholder2').css({
					'width': '100%',
					'min-height': '160px'
				});
				$("#dlading2").remove();
				$.plot(placeholder2, pieData2, optionPie);
				placeholder2.bind("plotclick", function(event, pos, obj) {
					var labelName = obj.series.label;
					// console.info(labelName);
					window.location.href = "/desktop" + '/' + stringToHex(labelName) + '/' + start + '/' + end + '/2'; //乙方公司
				});

			}); <!--get-pie-->
		}); <!--get-fund-->

	};

	var loadingTask = function() {
		waitToDo(); //代办任务
		$('#waitToDo').click(function() {
			$('#taskToFinish').html('');
			waitToDo();
		});

		$('#outDate').click(function() {
			$('#outOfDate').html('');
			outDate();
		});

		$('#finishedTask').click(function() {
			$('#isFinished').html('');
			finishedTask();
		});
	};

	var waitToDo = function() {
		//定义代办任务label边颜色
		var liColor = new Array('item-orange', 'item-red', 'item-default', 'item-blue',
			'item-grey', 'item-green', 'item-pink', 'item-orange', 'item-red', 'item-default', 'item-blue', 'item-grey', 'item-green', 'item-pink', 'item-orange', 'item-red', 'item-default', 'item-blue', 'item-grey', 'item-green', 'item-pink');

		var idIndex = 0;
		//代办任务
		$.get("/api/contracts/tasks/desktop", function(data, status) {
			var ulIndex = -1; //ul标签索引，根据它可以find到checkbox，进而添加click
			var t1, t2, t3, template;
			var zeroTitle; //title是否为零标识，以此作为合同结束标志
			var remark = ''; //备注信息
			var taskIsBlank = false;

			$.each(data, function(i, contract) {

				var templateModel = function(contract) {

					zeroTitle = false;

					//获取代办任务插入模版的数据
					var tdata = {
						id: contract._id,
						name: contract.name,
						title: contract.next.title,
						date: contract.next.date
					};

					//合同名称过长则进行省略处理
					var dataName = tdata.name;
					if (dataName.length > 5) {
						dataName = dataName.substring(0, 5) + "...";
					}
					if (tdata.title.length > 12) {
						dataName = dataName.substring(0, 3) + "...";
					}

					//定义插入模版
					t1 = "<ul style='height:100%' class='item-list'><li class='" + liColor[idIndex] + "'><label class='inline'><input type='checkbox'><span class='lbl'><span class='lbl' style=font-size:10px>" + tdata.title;
					t3 = "</span>&nbsp;<span class='lbl' style='color:silver'>" + tdata.date + "</span>&nbsp;<a href='" + "/contracts/" + tdata.id + "/edit' class='lbl' style='color:black'><span class='lbl' style='color:silver' title='" + tdata.name + "'>【" + dataName + "】</span></a></span></label><div class='pull-right'><button class='btn btn-mini btn-info'><i class='icon-edit bigger-123'></i></button></div></li></ul>";

					if (contract.next.title == 0) {
						template = null;
						zeroTitle = true;
					} else if (!contract.next.invoiceDone && contract.next.price > 0) {
						t2 = "<span style='color:red'>开发票</span>";
						template = t1 + t2 + t3;
						ulIndex++;
					} else {
						template = t1 + t3;
						ulIndex++;
					}

					idIndex++;
					if (idIndex >= 15)
						idIndex = 0;
				};

				var bindModel = function(ulIndex, contract) {
					var $buttonElement = $("#taskToFinish ul:eq(" + ulIndex + ")").find('button');

					//对于button，绑定事件之前一定要先解除前一次的绑定，否则会出错
					$buttonElement.unbind("click");
					$buttonElement.click(function() {

						bootbox.prompt("提示（填写备注信息）", function(result) {
							if (result == null)
								return;
							remark = result;
						});
					});

					var $inputElement = $("#taskToFinish ul:eq(" + ulIndex + ")").find('input');
					$inputElement.unbind("click");
					$inputElement.bind('click', {
						con: contract,
						uI: ulIndex
					}, function(e) {

						var $tempObj = $(this);
						var tempName = e.data.con.name;
						var checkValue = true;
						var newDate = '';

						bootbox.prompt("请确定是否提交,若代办任务时间有变化，请选择正确日期", function(result) {

							if (typeof(result) == 'object') {
								$tempObj.prop("checked", false);
								return;
							}
							newDate = $dataPicker.val();
							var postData = {
								_id: e.data.con._id,
								id: e.data.con.next.id,
								name: e.data.con.name,
								title: e.data.con.next.title,
								completed: checkValue,
								remark: remark,
								newDate: newDate
							};

							$.ajax({
								url: '/api/contracts/' + e.data.con.next.id + '/tasks',
								type: 'put',
								data: postData,
								error: function() {
									console.info('error');
								},
								success: function(result) {
									console.info('success');
									$.get("/api/contracts/tasks/desktop", function(data, status) {

										$.each(data, function(i, contract) {

											if (contract.name == tempName) {

												templateModel(contract);
												// console.info(contract);
												if (zeroTitle) {
													$tempObj.parent().parent().parent().fadeOut(1000);

													var html = $('#taskToFinish').html();
													if (html == "") {
														template = "<div id='blankTask' style='margin-top:100px'><ul class='center' style='font-size:16px'>没有需要待办的任务.</ul></div>";
														$('#taskToFinish').html(template);
													}

												} else {
													$tempObj.parent().parent().parent().replaceWith(template).show(500);

													bindModel(e.data.uI, contract);
												}
											}
										}); <!--each-->
									}); <!--get-->
								}
							});

						});

						var $dataPicker = $("div[class^='widget-boxx']").find("input");
						$dataPicker.removeClass("span12");
						$dataPicker.addClass('hidInput');
						$dataPicker.attr('data-date-format', 'yyyy-mm-dd');
						$dataPicker.attr('readonly', 'true');
						$dataPicker.removeAttr('autocomplete');
						$dataPicker.removeAttr('type');

						if (e.data.con.next.price > 0) {
							var ticketDone = e.data.con.next.invoiceDone;
							if (ticketDone == true)
								$dataPicker.val(e.data.con.next.priceDate);
							else
								$dataPicker.val(e.data.con.next.invoiceDate);
						} else {
							$dataPicker.val(e.data.con.next.date);
						}

						$dataPicker.datepicker({
							autoclose: true
						});
						$dataPicker.datepicker().on('changeDate', function(env) {
							$dataPicker.datepicker('hide');
						});
					});
				};
				if (contract.next.id != "0") {
					templateModel(contract);
					$('#taskToFinish').append(template);
					bindModel(ulIndex, contract);
				}

			}); <!--each-->

			//对待办任务部分为空的情况进行处理
			var html = $('#taskToFinish').html();
			if (html == "") {
				template = "<div id='blankTask' style='margin-top:100px'><ul class='center' style='font-size:16px'>没有需要待办的任务.</ul></div>";
				$('#taskToFinish').html(template);
				return;
			} else {
				if ($('#blankTask'))
					$('#blankTask').remove();
			}
		}); <!--get-->
	};

	var outDate = function() {
		//定义代办任务label边颜色
		var liColor = new Array('item-orange', 'item-red', 'item-default', 'item-blue',
			'item-grey', 'item-green', 'item-pink', 'item-orange', 'item-red', 'item-default', 'item-blue', 'item-grey', 'item-green', 'item-pink', 'item-orange', 'item-red', 'item-default', 'item-blue', 'item-grey', 'item-green', 'item-pink');

		var idIndex = 0;
		//过期任务
		$.get("/api/contracts/tasks/desktop", function(data, status) {

			var ulIndex = -1; //ul标签索引，根据它可以find到checkbox，进而添加click
			var t1, t2, t3, template;
			var remark = ''; //备注信息
			var idIndex = 0;

			//判断是否有过期任务
			function isBlank() {
				var html = $('#outOfDate').html();
				if (html == "") {
					template = "<div id='blankDate' style='margin-top:120px'><ul class='center' style='font-size:16px'>没有过期任务.</ul></div>";
					$('#outOfDate').html(template);
					return;
				} else {
					if ($('#blankDate'))
						$('#blankDate').remove();
				}
			};

			$.each(data, function(i, contract) {

				var templateModel = function(contract, j) {

					//获取代办任务插入模版的数据
					var tdata = {
						id: contract._id,
						name: contract.name,
						title: contract.undone[j].title,
						date: contract.undone[j].date,
					};

					//合同名称过长则进行省略处理
					var dataName = tdata.name;
					if (dataName.length > 5) {
						dataName = dataName.substring(0, 5) + "...";
					}
					if (tdata.title.length > 12) {
						dataName = dataName.substring(0, 3) + "...";
					}

					var tempDate;
					if (!contract.undone[j].completed && contract.undone[j].price == -1)
						tempDate = contract.undone[j].date;
					else if (!contract.undone[j].completed && !contract.undone[j].invoiceDone && contract.undone[j].price > 0)
						tempDate = contract.undone[j].invoiceDate;
					else if (!contract.undone[j].completed && contract.undone[j].invoiceDone && contract.undone[j].price > 0)
						tempDate = contract.undone[j].priceDate;

					//定义插入模版
					t1 = "<ul style='height:100%' class='item-list'><li class='" + liColor[idIndex] + "'><label id='" + contract.undone[j].id + "'class='inline taskcell'><input type='checkbox'><span class='lbl'><span class='lbl' style=font-size:10px>" + tdata.title;
					t3 = "</span>&nbsp;<span class='lbl' style='color:silver'>" + tempDate + "</span>&nbsp;<a href='" + "/contracts/" + tdata.id + "/edit' class='lbl' style='color:black'><span class='lbl' style='color:silver' title='" + tdata.name + "'>【" + dataName + "】</span></a></span></label><span style=font-size:10px;color:red>*</span><div class='pull-right'><button class='btn btn-mini btn-info'><i class='icon-edit bigger-123'></i></button></div></li></ul>";

					if ((!contract.undone[j].invoiceDone) && (contract.undone[j].price > 0)) {
						t2 = "<span style='color:red'>开发票</span>";
						template = t1 + t2 + t3;
					} else
						template = t1 + t3;

					ulIndex++;

					idIndex++;
					if (idIndex >= 15)
						idIndex = 0;
				};

				var bindModel = function(ulIndex, contract, j) {

					var $buttonElement = $("#outOfDate ul:eq(" + ulIndex + ")").find('button');

					$buttonElement.unbind("click");
					$buttonElement.click(function() {
						bootbox.prompt("提示（填写备注信息）", function(result) {
							if (result == null)
								return;

							remark = result;
						});
					});

					var $inputElement = $("#outOfDate ul:eq(" + ulIndex + ")").find('input');
					$inputElement.bind('click', {
						con: contract
					}, function(e) {
						console.info(ulIndex);
						var $tempObj = $(this);
						var tempName = e.data.con.name;
						var checkValue = true;
						var undoneID = $tempObj.parent().attr('id');
						var newDate = '';
						bootbox.prompt("请确定是否提交,若代办任务时间有变化，请选择正确日期", function(result) {

							if (typeof(result) == 'object') {
								$tempObj.prop("checked", false);
								return;
							}

							newDate = $dataPicker1.val();

							var postData = {
								_id: e.data.con._id,
								id: undoneID,
								name: e.data.con.name,
								title: e.data.con.undone[j].title,
								completed: checkValue,
								remark: remark,
								newDate: newDate
							};

							$.ajax({
								url: '/api/contracts/' + undoneID + '/tasks',
								type: 'put',
								data: postData,
								error: function() {
									console.info('error');
								},
								success: function(result) {
									console.info("here");
									console.info(result);
									$tempObj.parent().parent().parent().fadeOut(1000);
									var html = $('#outOfDate').html();
									if (html == "") {
										template = "<div id='blankDate' style='margin-top:120px'><ul class='center' style='font-size:16px'>没有过期任务.</ul></div>";
										$('#outOfDate').html(template);
									}
								}
							});
						});

						var $dataPicker1 = $("div[class^='widget-boxx']").find("input");
						$dataPicker1.removeClass("span12");
						$dataPicker1.addClass('hidInput');
						$dataPicker1.attr('data-date-format', 'yyyy-mm-dd');
						$dataPicker1.attr('readonly', 'true');
						$dataPicker1.removeAttr('autocomplete');
						$dataPicker1.removeAttr('type');

						var ticketDone = e.data.con.undone[j].invoiceDone;
						if (!ticketDone && (ticketDone != undefined))
							$dataPicker1.val(e.data.con.undone[j].invoiceDate);
						else if (ticketDone)
							$dataPicker1.val(e.data.con.undone[j].priceDate);
						else
							$dataPicker1.val(e.data.con.undone[j].date);

						$dataPicker1.datepicker({
							autoclose: true
						});
						$dataPicker1.datepicker().on('changeDate', function(env) {
							$dataPicker1.datepicker('hide');
						});
					});
				};

				for (var j = 0; j < contract.undone.length; j++) {

					templateModel(contract, j);
					$('#outOfDate').append(template);
					bindModel(ulIndex, contract, j);

				}
			}); <!--each-->

			isBlank();
		}); <!--get-->
	};

	var finishedTask = function() {

		var idIndex2 = 0;
		//定义代办任务label边颜色
		var liColor = new Array('item-orange', 'item-red', 'item-default', 'item-blue',
			'item-grey', 'item-green', 'item-pink', 'item-orange', 'item-red', 'item-default', 'item-blue', 'item-grey', 'item-green', 'item-pink', 'item-orange', 'item-red', 'item-default', 'item-blue', 'item-grey', 'item-green', 'item-pink');

		//已完成任务
		$.get('/api/contracts/tasks/dones', function(data, status) {

			$.each(data, function(i, contract) {

				var t1, t2, t3, template;

				for (var j = 0; j < contract.done.length; j++) {

					//获取代办任务插入模版的数据
					var tdata = {
						id: contract._id,
						name: contract.name,
						title: contract.done[j].title,
						date: contract.done[j].date,
						invoiceDate: contract.done[j].invoiceDate
					};

					//合同名称过长则进行省略处理
					var dataName = tdata.name;
					if (dataName.length > 5) {
						dataName = dataName.substring(0, 5) + "...";
					}

					//定义插入模版
					template = "<ul style='height:100%' class='item-list'><li class='" + liColor[idIndex2] + "'><label><span class='lbl'><span class='lbl'>" + tdata.title + "</span>&nbsp;&nbsp;<span class='lbl' style='color:silver'>" + tdata.date + "</span>&nbsp;&nbsp;<a href='/contracts/" + tdata.id + "/edit' class='lbl' style='color:black'><span class='lbl' style='color:silver' title='" + tdata.name + "'>【" + dataName + "】</span></a></span></label></li></ul>";

					if ((contract.done[j].invoiceDone) && !(contract.done[j].completed)) {
						template = "<ul style='height:100%' class='item-list'><li class='" + liColor[idIndex2] + "'><label><span class='lbl'><span class='lbl'>" + tdata.title + "<span style='color:red'>开发票</span></span>&nbsp;&nbsp;<span class='lbl' style='color:silver'>" + tdata.invoiceDate + "</span>&nbsp;&nbsp;<a href='/contracts/" + tdata.id + "/edit' class='lbl' style='color:black'><span class='lbl' style='color:silver' title='" + tdata.name + "'>【" + dataName + "】</span></a></span></label></li></ul>";
					}

					$('#isFinished').append(template);
					idIndex2++;
					if (idIndex2 >= 15)
						idIndex2 = 0;
				}

			});

			//判断是否有完成任务
			var html = $('#isFinished').html();
			if (html == "") {
				template = "<div id='blankFinished' style='margin-top:100px'><ul class='center' style='font-size:16px'>没有已完成任务.</ul></div>";
				$('#isFinished').html(template);
				return;
			} else {
				if ($('#blankFinished'))
					$('#blankFinished').remove();
			}
		});
	};

	initialize();

	//搜索功能实现
	$('#dsearchBtn').click(function() {
		$('#placeholder1').html('');
		$('#placeholder2').html('');
		$('#placeholder3').html('');
		start = $('#beginDate').val();
		end = $('#endDate').val();

		loadingPie(start, end);
	});

});