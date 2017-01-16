$(function(){
	setEvent();
})

/*性别设置*/
var sex = publicUtil.getParameter("sex");  //获取性别sex: 0男 1女
if (sex!="") {	//从首页选择性别进入
	if (sex=="0") {
		$(".pannel").addClass("girl");
	}else if (sex=="1") {
		$(".pannel").addClass("boy");
	}
}else{ //从首页重定向进入
	ajaxLoad(infoUrl,infoType,infoDataParam,getUserInfoSucc);
}


/*获取用户信息成功回调*/
function getUserInfoSucc(data){
	var info = data.returnItem;	
	/*1.根据性别显示相应内容*/
	var sex1 = info.gender;  //出题人性别: 0男 1女
	if (sex=="0") {
		$(".pannel").addClass("girl");
	}else if (sex=="1") {
		$(".pannel").addClass("boy");
	}

	var questionFlag = publicUtil.getParameter("questionFlag");  //未标记--已出题
	var masterFlag = publicUtil.getParameter("masterFlag");  //已标记--本人
	var answeredFlag = publicUtil.getParameter("answeredFlag");  //已标记--非本人--是否答题

	
}


/*设置点击事件*/
function setEvent(){
	/*查看默契排名*/
	$(".bang").on("touchend",function(){
		$(".mqpannel").fadeIn("fast");
	});

	/*关闭默契排名*/
	$(".mqpannel .closepannel").on("touchend",function(){
		$(".mqpannel").fadeOut("fast");
	});

	/*点击我也要玩*/
	$("#goplay").on("touchend",function(){
		window.location.href = "index.html";
	});
}