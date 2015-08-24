$(function() {
  //显示菜单路径
  var head = $("#breadcrumbs");
  var headText = $("#breadcrumbs").text().trim();
  // console.info(headText);
  if (headText == "首页") {
    // console.info(head.html());
    head.html('<ul class="breadcrumb">' +
      '<li><i class="icon-home"></i> <a href="/">首页</a><span class="divider"><i class="icon-angle-right"></i></span></li>' +
      '<li><a href="#">统计分析</a> <span class="divider"><i class="icon-angle-right"></i></span></li>' +
      '<li class="active">计划表</li></ul>');
  }

  var year = $("#getYear").val();
  var month = $("#getMonth").val();
  var type = $("#getType").val();

  if (type == "1") {
    $("#spanText1").html("计划回款列表");
    $("#spanText2").html("(" + year + "年" + month + "月）");
  } else {
    $("#spanText1").html("已回款列表");
    $("#spanText2").html("(" + year + "年" + month + "月）");
  }

  var initialize = function() {

    $.ajax({
      url: "/api/contracts/statistical/" + year + "/" + month + "/" + type,
      type: "get",
      // data : data,
      success: function(data) {
        // console.info("====fundCheck===data======");
        // console.info(data);
        showMonthList(data);
      },
      error: function(result) {
        bootbox.alert("获取" + month + "月款数据失败！");
      }
    });

  };

  var showMonthList = function(data) {
    $('#table1').html('');
    $.each(data, function(i, itemData) {
      // console.info(itemData);

      var contractName = itemData.name.replace(/(^\s*)|(\s*$)/g, "");
      // console.info("contractName.length" + contractName.length);
      if (contractName.length > 10) {
        contractName = contractName.substring(0, 10) + "...";
        // console.info("contractName = " + contractName);
      }

      //金钱逗号隔开显示
      var s1 = itemData.amount + "";
      itemData.amount = "￥" + s1.replace(/\B(?=(?:\d{3})+$)/g, ',');

      var s2 = itemData.price + "";
      itemData.price = "￥" + s2.replace(/\B(?=(?:\d{3})+$)/g, ',');
      var templateData = {
        id: itemData.id,
        name: contractName,
        completeName: itemData.name,
        partyAabbr: itemData.partyAabbr,
        partyBabbr: itemData.partyBabbr,
        amount: itemData.amount,
        price: itemData.price,
        priceDate: itemData.priceDate,
        title: itemData.title
      };

      var template = "<tr><td class=center title='" + itemData.name + "'><a href='/contracts/{{id}}/edit'>{{name}}</td><td class='hidden-480 center'>{{partyAabbr}}</td><td class='hidden-480 center'>{{partyBabbr}}</td><td class='hidden-480 center'>{{title}}</td><td class='center'>{{amount}}</td><td class=center>{{price}}</td><td class='center'>{{priceDate}}</td></tr>"

      var $html = $(Mustache.to_html(template, templateData));
      $('#table1').append($html);
    });

  };
  initialize();
});