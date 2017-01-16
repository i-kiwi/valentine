

$(function(){

	setRuleDom();
	setEvent();

	/*设置无刷新*/
	eventNoRefresh([{
	      id: "indexpannel",
	      uiType: "main",
	      title: document.title,
	      eventNode: ["#btnSelGift"],
	  },
	  {
	      id: "pannel",
	      uiType: "other",
	      title: "情人节"
	  }]);
})


/*获取用户信息*/
var selfOpenId = publicUtil.getParameter("openid");  //自己的openid
var otherOpenId = publicUtil.getParameter("otherOpenid");  //分享者的openid
var userInfo = JSON.parse(window.decodeURIComponent(publicUtil.getParameter("userInfo")));  //用户信息
var questionListArr = [];  //出题集合
var matchRankArr = [];  //匹配排名集合
var selfNickName = userInfo.nickName;  //自己昵称
var selfHeadImgUrl = userInfo.headImgUrl;  //自己头像
var selfGender = userInfo.sex;  //自己性别
var nickName = null;  //出题人昵称
var headImgUrl = null;  //出题人头像
var gender = null;  //出题人性别


var infoUrl = "/ValentineProject/getReturnInfo.do";
var infoType = "POST";
var infoDataParam = {
    "param" : JSON.stringify({
        "selfOpenId" : selfOpenId,  //自己的ID
        "openId" : otherOpenId  //出题人ID
    })
};
ajaxLoad(infoUrl,infoDataParam,infoType,getUserInfoSucc);


/*获取用户信息成功回调*/
function getUserInfoSucc(data){
	var info = data.returnItem;
	matchRankArr = info.rank;

	var linkFlag = info.linkFlag;	//链接标识
	if (!linkFlag) {	//未标记 
		var questionFlag = info.questionFlag;	//出题标识
		if (questionFlag) {	//已出题，进入自己的出题页
            nickName = info.name;  //昵称
            headImgUrl = info.headImg;  //头像
            gender = info.gender;  //性别

			askQuestionFlag = true;
			$("#picsBox").addClass("disabled");
			setQuestionsShow(info.theAnswer);

			addSexClass(gender);
			if($("#indexpannel").css("display")!="none"){
                $("#indexpannel").hide(function(){
                    $("#pannel").show();
                });
			}else{
                $("#pannel").show();
			}


		}else{	//未出题，停留在首页
            nickName = selfNickName;  //昵称
            headImgUrl = selfHeadImgUrl;  //头像
            gender = selfSex;  //性别


            if($("#pannel").css("display")!="none"){
                $("#pannel").hide(function(){
                    $("#indexpannel").show();
                });
            }else{
                $("#indexpannel").show();
            }
		}

		/*微信分享*/
		wechatShare.config.shareTitle = "无法开口的情人节礼物，就靠它啦！";  //分享标题
		wechatShare.config.shareDesc = "TA懂，ta不懂，ta懂，ta不懂.......^O^要不要暗示TA一下咧";  //分享描述
		wechatShare.config.shareLink = window.location.href.split("?")[0]+"?otherOpenid="+selfOpenId;  //分享链接
		
	}else{	//已标记，进入出题答题页
        nickName = info.name;  //昵称
        headImgUrl = info.headImg;  //头像
        gender = info.gender;  //性别

		var masterFlag = info.masterFlag;	//出题者标识
		if (masterFlag) {	//本人
			askQuestionFlag = true;
			$("#picsBox").addClass("disabled");
			setQuestionsShow(info.theAnswer);

			console.log(info.theAnswer)
		}else{	//非本人
			var answeredFlag = info.answeredFlag;	//答题标识
			questionListArr = info.theAnswer;

			if (answeredFlag) {	//已答
				$("#picsBox").addClass("disabled");
				setAnsersShow(info.answer);
			}else{	//未答
				
			}
			$("#pannel").addClass("answer");
		}

		addSexClass(gender);


        if($("#indexpannel").css("display")!="none"){
            $("#indexpannel").hide(function(){
                $("#pannel").show();
            });
        }else{
            $("#pannel").show();
        }


		/*微信分享*/
		wechatShare.config.shareTitle = nickName+"：我要的情人节礼物老高级了，惊呆ingo(￣▽￣)d！";  //分享标题
		wechatShare.config.shareDesc = "矫情一下，伦家的心思你要不要猜猜看(*＾-＾*)";  //分享描述
		wechatShare.config.shareLink = window.location.href.split("?")[0]+"?otherOpenid="+otherOpenId;  //分享链接

	}

	/*分享初始化*/
//	wechatShare.init();
}


/*根据性别显示相应界面*/
function addSexClass(sexType){
	if (sexType=="0") {
		$("#pannel").addClass("girl");
		$("#dialogpannel").addClass("girl");
	}else if (sexType=="1") {
		$("#pannel").addClass("boy");
		$("#dialogpannel").addClass("boy");
	}
}

/*显示出题者的题目列表*/
function setQuestionsShow(qlist){
	for(var i=0,len=qlist.length; i<len; i++){
		var idx = Number(qlist[i])-1;
		$("#picsBox .pic").eq(idx).addClass("selected");
	}
}

/*显示答题者的题目列表*/
function setAnsersShow(qlist){
	var failArr = qlist;
	for(var i=0,len=qlist.length; i<len; i++){	//答题集合
		var idx = Number(qlist[i])-1;
		for(var k=0,klen=questionListArr.length; k<klen; k++){ //出题集合
			var kidx = Number(questionListArr[k])-1;
			if (kidx == idx) {  //答案匹配成功
				failArr.splice(i,1);
				$("#picsBox .pic").eq(idx).addClass("succ");
				break;
			}
		}		
	}

	if (failArr.length>0) { //答案匹配失败
		for(var m=0,mlen=failArr.length; m<mlen; m++){
			var idx = Number(qlist[m])-1;
			$("#picsBox .pic").eq(idx).addClass("fail");
		}
	}
}


/*检查答题者的题目匹配状态*/
function checkAnsers(answ){
	var idx = Number(answ)-1;
	var matchFlag = false;
	for(var k=0,klen=questionListArr.length; k<klen; k++){ //出题集合
		var kidx = Number(questionListArr[k])-1;
		if (kidx == idx) {  //答案匹配成功
			matchFlag = true;
			$("#picsBox .pic").eq(idx).addClass("succ");
			break;
		}
	}	

	if (!matchFlag) { //答案匹配失败
		$("#picsBox .pic").eq(idx).addClass("fail");
	}
}



/*设置点击事件*/
var askQuestionFlag = false;  //从首页进入出题标志
var getMatchRankFlag = false;  //是否已获取排名
function setEvent(){
	/*查看默契排名*/
	$(".bang").on("touchend",function(){
		if (!getMatchRankFlag) {
			getMatchRankFlag = true;
			setMatchRank(matchRankArr);						
		}
		$(".mqpannel").fadeIn("fast");
	});

	/*关闭默契排名*/
	$(".mqpannel .closepannel").on("touchend",function(){
		$(".mqpannel").fadeOut("fast");
	});


	/*点击开始选礼物进入出题页*/
  	$("#btnSelGift").on("touchend",function(){
  		var sex = $(".checkarea").find("input:checked").val();
  		gender = sex;
  		addSexClass(sex);  		

		$("#indexpannel").hide();
		$("#pannel").show();
  	});


  	/*点击我也要玩按钮*/
  	$("#btnPlayToo").on("touchend",function(){
  		var ztitle = document.title;
        var href = window.location.href,
            pageParam = publicUtil.getParameter("page"),
            pageParamArr = (href.indexOf("&page=")>-1)?href.split("&page="+pageParam):href.split("page="+pageParam),
            paramsFlag = href.indexOf("?")>-1;
        href = pageParamArr[0]+(pageParamArr[1]?pageParamArr[1]:"");
  		var zurl = "";
        if (paramsFlag) {
            zurl= "?"+href.split("?")[1]+"&page=playToo";
        }else{
            zurl= "?page=playToo";
        }
        history.pushState({
            "title": ztitle,
            "url": zurl
        }, ztitle, zurl);

  		/*重置*/
  		$("#picsBox .pic").removeClass("selected checked succ fail");  		
  		$("#picsBox").removeClass("disabled");
  		$("#pannel").removeClass("answer boy girl");
  		

  		/*调用接口判断*/
  		var infoDataParam1 = {
			"param" : JSON.stringify({
			  "selfOpenId" : selfOpenId,  //自己的ID
			  "openId" : selfOpenId  //出题人ID
			})
		};
		ajaxLoad(infoUrl,infoDataParam1,infoType,getUserInfoSucc);
  	});


  	/*点击找TA测测按钮*/
  	$("#btnTestTA").on("touchend",function(){
  		
  		if (!askQuestionFlag) {  //未提交出题
	  		var answersCount = $("#picsBox .pic.selected").size();
	  		if (answersCount == 3) {
	  			var questionList = [];
	  			$("#picsBox .pic.selected").each(function(){
					questionList.push(Number($(this).index())+1);
	  			});


	  			/*提交出题*/
	  			var askUrl = "/ValentineProject/setQuestion.do";
				var askType = "POST";
				var askDataParam = {
					"param" : JSON.stringify({
						  "openId" : selfOpenId,  //出题人ID
						  "name" : nickName,  //姓名
						  "headImg" : headImgUrl,  //头像地址
						  "gender" : gender,  //性别
						  "theAnswer" : questionList  //答案集合
						})
					};
				console.log("eeee==="+askDataParam);
				ajaxLoad(askUrl,askDataParam,askType,sendAskSucc);
	  		}else if (answersCount < 3) {
	  			publicUtil.alert("请选择至少3个礼物");
	  		}else if (answersCount > 3) {
	  			publicUtil.alert("最多只能选择3个礼物");
	  		}
  		}else{
  			$("#shareMask").show();
  		}
  	});

  	/*关闭找TA测测分享蒙层*/
  	$("#shareMask .shareclose").on("touchend",function(){
  		$("#shareMask").hide();  		
  	});

  	/*选择题目*/
  	$("#picsBox .pic").on("touchend",function(){
  		var answeredFlag = $(this).parents("#pannel").hasClass("answer"); //是否答题
  		var disabledFlag = $(this).parents("#picsBox").hasClass("disabled"); //是否可以编辑

  		if (disabledFlag) {	//不可编辑
  			return;
  		}

  		if (!answeredFlag) {	//出题页
  			$(this).toggleClass("selected");
            if ($("#picsBox .pic.selected").size()>3) {
            	publicUtil.alert("最多只能选择3个礼物");
                return;
            }
  		}else{	//答题页
  			$(this).addClass("checked");
  			checkAnsers(Number($(this).index())+1); //检查匹配状态
  			
  			//提交答题显示匹配度
  			if ($("#picsBox .pic.checked").size()!=3) {
  				return;
  			}
  			$("#picsBox").addClass("disabled");
  			var answersList = [];
  			$("#picsBox .pic.checked").each(function(){
				answersList.push(Number($(this).index())+1);
  			});

  			/*提交答题*/
  			var answUrl = "/ValentineProject/answerQuestion.do";
			var answType = "POST";
			var answDataParam = {
				"param" : JSON.stringify({
				  "openId" : otherOpenId,  //出题人ID
				  "selfOpenId" : selfOpenId,  //答题人ID
				  "name" : nickName,  //姓名
				  "headImg" : headImgUrl,  //头像地址
				  "gender" : gender,  //性别
				  "theAnswer" : answersList  //答案集合
				})
			};
			ajaxLoad(answUrl,answDataParam,answType,sendAnsersSucc);
  		}
  	});


  	/*关闭默契度弹框*/
  	$("#dialogpannel .closepannel").on("touchend",function(){
  		$("#dialogpannel").hide();
  		return false;
  	});
  	/*默契度弹框滑动处理*/
  	$("#dialogpannel").on("touchmove",function(){
  		return false;
  	});
}


/*出题成功回调*/
function sendAskSucc(data){
	publicUtil.alert("出题成功");
	askQuestionFlag = true;
	$("#picsBox").addClass("disabled");	
	$("#shareMask").show();
}


/*答题成功回调*/
function sendAnsersSucc(data){
	var info = data.returnItem;
	var percent = Math.floor(info.score) +"";
	var succCount = $("#picsBox .pic.succ").size();
	var showDesc = matchPercent(succCount+"");

	$("#matchPercent").html(percent+"%"); //默契度
	$("#matchDesc").html(showDesc); //默契度文案

	var resultStr = "";
	$("#picsBox .pic.checked").each(function(indx,value){
		var indx = Number($(this).index())+1;
		var rslClass = $(this).hasClass("succ")?" succ":" fail";
		resultStr += '<li class="reli'+rslClass+'">\
                        <div class="repic repic'+indx+'"></div>\
                    </li>';
	});
	$("#matchRsltList").html(resultStr);  //匹配图片集合
	$("#dialogpannel").show();
}


/*设置匹配排名列表*/
function setMatchRank(ranklist){
	if (ranklist && ranklist.length>0) {
		var rankListStr = "";
		for (var i = 0,len=ranklist.length; i < len; i++) {
			var item = ranklist[i],
				idx = Number(i)+1,  //排名
				headUrl = item.headImg,  //头像
				name = item.name,  //昵称
				score = Math.floor(item.score),  //分数
				answersList = item.theAnswer;  //答案集合

			var gistListStr = "";
			for(var k=0,klen=answersList.length; k<klen; k++){				
				var gift = matchGift(answersList[k]);
				gistListStr += gift;
				if (k != klen-1) {
					gistListStr += '、';
				}
			}

			rankListStr += '<li class="blist">\
                    <div class="headimg" data-ind="'+idx+'">\
                        <img src="'+headUrl+'" alt="" class="himg">\
                    </div>\
                    <div class="info">\
                        <p class="name">'+name+'</p>\
                        <p class="answers"><span class="ans">'+gistListStr+'</span><span class="percent">'+score+'%</span></p>\
                    </div>\
                </li>';
		}
		$("#mqpannel .banglist").html(rankListStr);
	}else{
		$(".banglist").hide();
		$("#mqpannel .nodata").show();
	}
}


/*礼物匹配*/
var boyGiftsArr = [
	"运动鞋","臀","哑铃","手表",
	"书","皮鞭","软饭","游戏手柄",
	"志玲姐姐","手机","吉他","高额保单",
	"跑车","大保健","酒","人生巅峰"
];
var girlGiftsArr = [
	"鲜花","越吃越瘦","银行卡","高跟鞋",
	"黄瓜","包包","香水","高额保单",
	"丝袜","口红","钻戒","豪宅",
	"豪车","车票","宝宝","马云爸爸"
];
function matchGift(num){
	num = num-1;
	if (gender == "0") { //女
		return boyGiftsArr[num];
	}else{ //男
		return girlGiftsArr[num];
	}
}


/*设置活动规则弹窗DOM*/
function setRuleDom(){
  var ruleString = "<div class='rulecover'>\
            <div class='closepannel'></div>\
            <div  class='rulehead'></div>\
            <p class='rulelist'><span class='nicon'>1</span><span class='desc'>挑选你最希望收到的三件情人节礼物。</span></p>\
            <p class='rulelist'><span class='nicon'>2</span><span class='desc'>分享给好友，凭借默契，好友选出你喜欢的礼物。</span></p>\
            <p class='rulelist'><span class='nicon'>3</span><span class='desc'>根据测试结果，就可以知道你们的默契程度啦~</span></p>\
          </div>";
  var rp = document.querySelector("#rulepannel");
      rp.innerHTML = ruleString;

  /*打开活动规则*/
  $(".rules").on("touchend",function(){
      $("#rulepannel").fadeIn("fast");
  });

  /*活动规则滑动处理*/
  $("#rulepannel").on("touchmove",function(){
      return false;
  });

  /*关闭活动规则*/
  $("#rulepannel .closepannel").on("touchend",function(){
      $("#rulepannel").fadeOut("fast");
      return false;
  });
  // $("#rulepannel").on("touchend",function(){
  //     $("#rulepannel").fadeOut("fast");
  //     return false;
  // });
}



/*匹配度文案匹配*/
function matchPercent(state){
	var str = "";
	switch(state){
		case "0": str = "好尴尬啊，<br/>TA藏的好深，点在哪里？哪里？……"; break;  //选对0个礼物
		case "1": str = "礼不礼物不重要啦~<br/>重要的是我要你“上心”。"; break;  //选对1个礼物
		case "2": str = "word亲爱哒，<br/>你是老司机还是真懂我？"; break;  //选对2个礼物
		case "3": str = "居然都对啦~<br/>是不是都送给TA，麦噶得！我要静静"; break;  //选对3个礼物
	}
	return str;
}






