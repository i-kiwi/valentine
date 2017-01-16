
var prodName = "";  //接口加密字段prodName值

/*公用功能*/
var publicUtil = {
    "getParameter" : function(param) {  //获取路径参数
      var query = window.location.search,
          iLen = param.length,
          iStart = query.indexOf(param);
      if (iStart == -1) 
        return "";
      iStart += iLen + 1;
      var iEnd = query.indexOf("&", iStart);
      if (iEnd == -1)
        return query.substring(iStart);
      return query.substring(iStart, iEnd);
  },
    "popLoader" : function(){ //弹出加载中
      $('.z_loader').remove();
      var loaderStr='<div class="z_loader">\
                <div class="z_loadercon">\
                  <div class="loading"><b class="circle"></b></div>\
                  <p>努力加载中...</p>\
                </div>\
              </div>';
      $("body").append(loaderStr);
      $(".z_loader").fadeIn();
    },
    "closeLoader" : function(){ //关闭加载中
      $(".z_loader").hide();
    },
    "alert" : function(msg,time){  //弹出alert信息,默认2秒后消失
      var _time = time? time*1000 : 2000;
      if (document.getElementById("alert_mask")) {
        $("#alert_mask").remove();
      }
      
      var alertStr='<div class="alert_mask" id="alert_mask">\
            <section class="alert_section" id="alert_section">\
              <div class="alert_content">\
                <p>'+msg+'</p>\
              </div>\
            </section>\
          </div>';
        $("body").append(alertStr);

      setTimeout(function(){
        $("#alert_mask").remove();
      }, _time);
    },
    "setDocumentTitle" : function(title){ //设置标题兼容iPhone：@pram: str标题字符串 
        var $body = $('body');
        document.title = title;
        var $iframe = $("<iframe style='display:none;' src='../resources/images/favicon.ico'></iframe>");
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);
    }
};


/*ajax调用封装*/
function ajaxLoad(url,dataParams,type,doneSucc,doneFail,compeleteSucc){
    //GET请求接口拼接随机时间戳
    url = type.toLowerCase()=="get"? (url+"?random="+Math.random()) : url;
    var ajaxParamObj = {
        url: url,
        type: type,
        data: dataParams,
        dataType: "json"
    };

    //同步请求: 值为true或者false
    if (typeof(dataParams) == "object" && typeof(dataParams.async)!="undefined") { 
      ajaxParamObj.async = dataParams.async;
      delete dataParams.async;
    }

    //设置contentType: 值为true则设置
    if (typeof(dataParams) == "object" && typeof(dataParams.contentType)!="undefined" && dataParams.contentType) { 
      ajaxParamObj.contentType = "application/json; charset=utf-8";
      delete dataParams.contentType;
    }

    console.log("请求接口参数："+JSON.stringify(ajaxParamObj));

    alert("入参："+JSON.stringify(ajaxParamObj.data));
    publicUtil.popLoader();
    $.ajax(ajaxParamObj)
    .done(function(data) {
        alert(JSON.stringify(data));
        if (data.returnCode == "SUCCESS") {
          doneSucc(data);
        }else{
          if (typeof(doneFail) == "function") {
            doneFail(data);
          }else{
            publicUtil.alert(data.returnMessage);
          }
        }
        
    })
    .fail(function() {
        publicUtil.alert("网络正在开小差，请检查网络连接！");
    })
    .always(function() {
        publicUtil.closeLoader();
        if(typeof(compeleteSucc) == "function") {
          compeleteSucc();
        }
    });
}

/*------------encoding------------*/
var encrypt = {encrypt:function(){}};
function tkEncoding() {
  var jqscriptEle = document.createElement("script");
  jqscriptEle.src = "../js/jsencrypt.min.js";
  document.head.insertBefore(jqscriptEle, document.head.childNodes[0]);
  jqscriptEle.onload = function() {
      $.ajax({
        url: window.location.origin+'/securityData/rsa/getPubKey?prodName='+prodName,
        type: 'GET',
        async: false
      })
      .done(function(res) {
        encrypt = new JSEncrypt();
        encrypt.setPublicKey(res);        
      })
      .fail(function() {
        publicUtil.alert('tkEncoding fail');
      });
  }
}
/*------------encoding*End------------*/


/*------------base64*start------------*/
/**
*
*  Base64 encode / decode
*
*  @author haitao.tu
*  @date   2010-04-26
*  @email  tuhaitao@foxmail.com
*
*/
 
function Base64() {
 
  // private property
  _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 
  // public method for encoding
  this.encode = function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = _utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
      _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }
 
  // public method for decoding
  this.decode = function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = _keyStr.indexOf(input.charAt(i++));
      enc2 = _keyStr.indexOf(input.charAt(i++));
      enc3 = _keyStr.indexOf(input.charAt(i++));
      enc4 = _keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = _utf8_decode(output);
    return output;
  }
 
  // private method for UTF-8 encoding
  _utf8_encode = function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
 
    }
    return utftext;
  }
 
  // private method for UTF-8 decoding
  _utf8_decode = function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while ( i < utftext.length ) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
}
/*------------base64*End------------*/


/*
  pramsConfig：用来存储历史对象的数组
  @pram id: page的id，控制显示隐藏区域
  @pram title: page的标题
  @pram eventNode: 绑定事件的jQuery结点（id或classname）
  
  eg:
    eventNoRefresh([{
          id: "id1",
          uiType: "main",
          title: document.title,
          eventNode: [""],
      },
      {
          id: "id2",
          uiType: "other",
          title: "",
          eventNode: ""
      }],selCallback); 
*/
function eventNoRefresh(pramsConfig,selectCallback) {
  var theurl=pramsConfig,
      href = window.location.href,
      pageParam = publicUtil.getParameter("page"),
      pageParamArr = (href.indexOf("&page=")>-1)?href.split("&page="+pageParam):href.split("page="+pageParam),
      paramsFlag = href.indexOf("?")>-1;
      href = pageParamArr[0]+(pageParamArr[1]?pageParamArr[1]:"");
      console.log(href);

  $(theurl).each(function(index,value){
    if (paramsFlag) {
      theurl[index]["url"]= "?"+href.split("?")[1]+"&page="+theurl[index]["id"];
    }else{
      theurl[index]["url"]= "?page="+theurl[index]["id"];
    }    
  });


  /*加入点击事件*/
    if (window.history.pushState) {            
        $(theurl).each(function(index,value){
          var elem=theurl[index];
          var type=elem["uiType"];
          if(type=="main"){ //主界面按钮事件
            $(elem["eventNode"]).each(function(i,v){
                $(elem["eventNode"][i]).on("click", function() {
                  $("body").animate({"scrollTop":0},0); //滚动到顶部
                  setTitle(theurl[Number(i)+1]["title"]);
                  setHistory(theurl[0], theurl[Number(i)+1]); //设置历史
                });
            });
          }else{ //非主界面按钮事件
            if (elem["eventNode"]) {
              $(elem["eventNode"]).on("click", function() {
                if (selectCallback) {
                  selectCallback(this);
                }
                setTitle(theurl[0]["title"]);
                window.history.go(-1);
              });
            } 
          }   
        });

        window.addEventListener("DOMContentLoaded",function(){
          var obj = theurl[0];
            $("#" + obj["id"]).show();
            history.replaceState({
                "title": obj.title,
                "url": obj.url
            }, obj.title, obj.url);
        },false);

        window.addEventListener("popstate", function() {
            console.log(history.state)

            /*特殊操作：从我也要玩界面后退到答题主界面*/
            console.log(publicUtil.getParameter("page"))

            if(publicUtil.getParameter("page")=="indexpannel"){
                console.log("enter====playToo")
                window.location.reload();
            }

            /*特殊操作：已出题后退无效*/
            if(askQuestionFlag){
                return;
            }

            var currentState = history.state;
            matchHistory(currentState.url, theurl);
        });

    } else {
        alert("window.history.pushState不存在或为空");
    }

    /*存储历史记录*/
    function setHistory(x, y) {
      console.log(JSON.stringify(x),JSON.stringify(y))
        $("#" + y.id).show();
        $("#" + x.id).hide();
        history.pushState({
            "title": x.title,
            "url": x.url
        }, x.title, x.url);
        history.replaceState({
            "title": y.title,
            "url": y.url
        }, y.title, y.url);
    }

    /*匹配历史记录*/
    function matchHistory(stateurl, obj) {
        // var xurl = stateurl.split("?")[1].split("=")[1];
        var xurl = publicUtil.getParameter("page",stateurl);
        $.each(obj, function(index, el) {
            if (el.id == xurl) {
                setTitle(theurl[index]["title"]);
                $("#" + el.id).show();
            } else {
                $("#" + el.id).hide();
            }
        });
    }

    /*设置标题兼容iPhone：@pram: str标题字符串*/
    function setTitle(str){
      publicUtil.setDocumentTitle(str);
    }
}