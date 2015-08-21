define([
        "underscore",
        "backbone",
        "jquery",
        'text!template/DesktopShowView.html',
        'config/config',
        'js/jquery.flot',
        'js/jquery.flot.pie',
], function(_, Backbone, $, DesktopShowViewHtml, Config, JQFlot, JQFlotPie) {

    var ChartShow = Backbone.View.extend({
        initialize: function(options) {
            this.render();
        },
        render: function() {

            //计算各航空的合同数目
            var partyA = new Array(),
                partyB = new Array();
            var contractsCount = 0;

            $.get(Config.Server("contracts"), function(data, status) {
                _.each(data, function(contract) {
                    partyA[contractsCount] = contract.partyA;
                    partyB[contractsCount] = contract.partyB;
                    contractsCount++;

                });

                //根据统计的数据画出饼图
                var optionPie1 = {
                    series: {
                        pie: {
                            show: true,
                            radius: 'auto',
                            label: {
                                show: true,
                                radius: 1,
                                formatter: function(label, slice) {
                                    return '<div style="font-size:x-small;text-align:center;padding:2px;color:' + slice.color + ';">' + '<br/>' + Math.round(slice.percent) + '%</div>';
                                },
                                background: {
                                    opacity: 0,
                                    color: null
                                }
                            }
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    }
                };

                //定义颜色数组
                var color = new Array("#FF0033","#3300FF","#00CCFF","#FF00FF","#FF3300",
                            "#00CC99","#33FF66","#66FF00","#00FFFF","#CC6666","#3399FF",
                            "#00FF33","#CCFF99","#FFCC66","#CC3300","#FF33CC","#FF0066");

                var pieData1 = new Array(),
                    pieData2 = new Array();

                for(var i=0;i<contractsCount;i++) {
                    if(partyA[i] == 0)
                        continue;
                    var countA = 1;
                    for(var j=i+1;j<contractsCount;j++) {
                        if((partyA[j] != 0) && (partyA[j] == partyA[i])) {
                            countA++;
                            partyA[j] = 0;
                        }   
                    }
                    pieData1.push({label: partyA[i],
                                data:countA,
                                color:color[i]});
                }
                for(var i=0;i<contractsCount;i++) {
                    if(partyB[i] == 0)
                        continue;
                    var countB = 1;
                    for(var j=i+1;j<contractsCount;j++) {
                        if((partyB[j] != 0) && (partyB[j] == partyB[i])) {
                            countB++;
                            partyB[j] = 0;
                        }   
                    }
                    pieData2.push({label: partyB[i],
                                data:countB,
                                color:color[i+4]});
                }
               
                $.plot($("#container1"), pieData1, optionPie1);
                $("#container1").bind("plotclick", function(event, pos, obj) {
                    window.location.hash = "#pieDetial" + '/' + obj.series.label;
                });

                var optionPie2 = {
                    series: {
                        pie: {
                            show: true,
                            radius: 'auto',
                            label: {
                                show: true,
                                radius: 1,
                                formatter: function(label, slice) {
                                    return '<div style="font-size:x-small;text-align:center;padding:2px;color:' + slice.color + ';">' + '<br/>' + Math.round(slice.percent) + '%</div>';
                                },
                                background: {
                                    opacity: 0,
                                    color: null
                                }
                            }
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true
                    }
                };
               
                $.plot($("#container2"), pieData2, optionPie2);
                $("#container2").bind("plotclick", function(event, pos, obj) {
                    window.location.hash = "#pieDetial" + '/' + obj.series.label;
                });
                $("#content1").text("甲方公司");
                $("#content2").text("乙方公司");
            });
            return this;
        }
    });
    return ChartShow;
});