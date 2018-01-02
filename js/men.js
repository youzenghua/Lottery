$(function() {
	var all = []; //所有参与人
	var filter = []; //中奖人缓存
	var flag = true; //可否抽奖状态标识
	var type = ""; //抽奖类型
	var ttimer = null; //计时器
	var d = 0; //单次抽奖人数
	$.getJSON("js/men.json", function(data) {
		all = data;
	});

	$("#showbox").click(function() {
		$("#mask").show();
	})

	$(".typebox li").click(function(e) {
		d = parseInt($(this).data("count"));
		type = $(this).text();
		$("#showbox").text(type);
		$("#mask").hide();
	})
	//点击开始抽奖
	$("#btn").click(function(e) {
		if(flag) {
			flag = false;
			active(d);
			showAll(all);
		} else {
			clearInterval(ttimer);
			$("#lucktitle").show();
			$("#resbox").show();
			var b = 0;
			var timer = setInterval(function() {
				var tfilter = filter[b];
				if(b == d) {
					clearInterval(timer);
					if(localStorage.getItem(type)) {
						var newlist = localStorage.getItem(type) + "|" + filter.join("|");
						localStorage.setItem(type, newlist);  //写入浏览器本地存储
					} else {
						localStorage.setItem(type, filter.join("|"));//追加存储
					}
					var blob = new Blob([localStorage.getItem(type)], {
						type: "text/plain;charset=utf-8"
					});
					saveAs(blob, type + ".txt");
					filter = [];
					flag = true;
					return;
				}
				$("#resbox").append("<li>" + tfilter[0] + "</li>");
				b++;
			}, 100);
			$("#cbox").html("本轮抽奖结束！");
			$("#btn").text("抽奖");
		}
	})
	//名单滚动
	function showAll(obj) {
		$("#lucktitle").hide();
		$("#resbox").hide().html("");
		var men = obj;
		ttimer = setInterval(function() {
			var i = RandomNumBoth(0, obj.length - 1);
			$("#cbox").html(men[i][0] + "<br/>" + men[i][1]);
		}, 50)
	}
	//抽奖函数
	function active(c) {
		//c：单次中奖人数
		for(var i = 0; i < c; i++) {
			//写入中奖名单数组，并从所有人中剔除
			filter.push(all.splice(RandomNumBoth(0, all.length - 1), 1));
		}
		$("#btn").text("停止");
	}
	//随机取数
	function RandomNumBoth(Min, Max) {
		var Range = Max - Min;
		var Rand = Math.random();
		var num = Min + Math.round(Rand * Range); //四舍五入
		return num;
	}
});