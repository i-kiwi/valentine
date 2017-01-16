// $(function(){
//   wechatShare.init(); 
// })

document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
  WeixinJSBridge.call('hideOptionMenu');
  WeixinJSBridge.call('hideToolbar');
});


var wechatShare={
  "config" : {
      "debugFlag"  : false,   //是否开启微信debug模式: true 开启  false 关闭
      "isTestFlag" : true,  //是否是测试环境：true 测试  false 生产
      "shareTitle" : "",  //分享标题 
      "shareDesc"  : "", //分享描述
      "shareImgurl": window.location.origin+"/valentine/images/share.png",  //分享给朋友图片链接
      "shareLink"  : ""  //分享oauth链接:参数为点击分享链接进入的页面链接
  },
  "EnvironMatch" : {
       "domains" : [{   //匹配的域名数组
          "domainName" : "http://wxpt-t.taikang.com",
          "isTestFlag" : true
        },{
          "domainName" : "http://localhost:8080",
          "isTestFlag" : true
        },{
          "domainName" : "http://q.taikang.com",
          "isTestFlag" : false
        },{
          "domainName" : "http://fans-t.activity.wx.taikang.com",
          "isTestFlag" : true
        },{
          "domainName" : "http://fans.activity.wx.taikang.com",
          "isTestFlag" : false
      }],
      "testConfig" : {  //测试环境appid及oauth的redirect_uri
        "appid" : "wxdbbe2c84a6e68304",
        "redirect_uri" : "http://wxpt-t.taikang.com"
      },
      "productConfig" : {  //生产环境appid及oauth的redirect_uri
        "appid" : "wx2f763d09aa9ca523",
        "redirect_uri" : "http://wxpt.taikang.com"
      }
  },
  "getEnvironConfig" : function(){  //获取环境apppid&redirect_uri&oauth链接
      var domain = window.location.origin;
      var domainsArr = this.EnvironMatch.domains;
      for(var i in domainsArr){
         var item = domainsArr[i];
         if(item.domainName == domain){
            if(item.isTestFlag){
              this.config.appid = this.EnvironMatch.testConfig.appid;
              this.config.redirect_uri = this.EnvironMatch.testConfig.redirect_uri;              
            }else{
              /*alert重写*/
              window.alert = function(){};

              this.config.appid = this.EnvironMatch.productConfig.appid;
              this.config.redirect_uri = this.EnvironMatch.productConfig.redirect_uri;
            }
            this.config.oauthLink = this.creatfLink(this.config.shareLink);
            return false;
         }
      }
  },
  "init" : function(){      
      $.ajaxSetup({
        cache : true
      });
      //this.base64Onload();
      this.shareInit();
  },
  "creatfLink" : function(link){  //生成oauth链接
      var baseUrl = new Base64();  
      var newlink = baseUrl.encode(link);
      var fLink="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+ this.config.appid +"&redirect_uri="+ this.config.redirect_uri +"/tkmap/wechat/oauth2/redirectuser/"+ this.config.appid +"?other="+ newlink +"&response_type=code&scope=snsapi_userinfo&state=redict&connect_redirect=1#wechat_redirect";   //分享链接
      return fLink;
  },
  "base64Onload" : function(){  //base64.js加载
      $.getScript("../js/base64.js")
      .done(function(script, textStatus) {
        if(textStatus=="success"){
          console.log("base64.js加载完成");
        }else{
          alert("base64.js加载失败："+textStatus);
        }
      })
      .fail(function(jqxhr, settings, exception) {
        alert("base64.js加载失败："+jqxhr);
      });
  },
  "shareInit" : function(){ //wx.js加载
      var _this=this;
      $.getScript("http://res.wx.qq.com/open/js/jweixin-1.0.0.js")
      .done(function(script, textStatus) {
        if(textStatus=="success"){
          console.log("jweixin-1.0.0.js加载完成");
          _this.getSignature();
        }else{
          alert("jweixin-1.0.0.js加载失败："+textStatus);
        }
      })
      .fail(function(jqxhr, settings, exception) {
        alert("jweixin-1.0.0.js加载失败："+jqxhr);
      });
  },
  "getSignature" : function(){  //获取签名接口
      this.getEnvironConfig();
      var _this=this;
      var pageUrl=encodeURIComponent(window.location.href.split('#')[0]);   //页面地址
      // z_poploader();
      $.ajax({
            type : "GET",
            url:"/tkmap/wechat/jsapi/getSignature.do",
            // url:"../js/signature.json",
            data:"appId="+ _this.config.appid +"&url="+ pageUrl,
            dataType : "json"
        })
        .done(function(data) {
          //alert(JSON.stringify(data));

          _this.shareConfig(data);

          wx.ready(function(){
            wx.showOptionMenu();
            _this.shareMenu.onMenuShareAppMessage(_this.config);
            _this.shareMenu.onMenuShareTimeline(_this.config);
            _this.hideMenuItems();
          });

          wx.error(function(res){
            wx.hideOptionMenu();
            alert("微信分享出现错误！");
          });

        })
        .fail(function() {
            alert("网络正在开小差，请检查网络连接！");
        })
        .always(function() {
            // z_closeloader();
        });
  },
  "shareConfig" : function(signObj){  //微信config注入
      var _this = this;
      var configs = this.config;
      wx.config({
        debug: configs.debugFlag, 
        appId: configs.appid,
        timestamp: signObj.timestamp,
        nonceStr: ''+(signObj.noncestr)+'',
        signature: ''+(signObj.signature)+'',
        jsApiList: [
          'checkJsApi',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'hideMenuItems',
          'hideAllNonBaseMenuItem',
          'getNetworkType',
          'getLocation',
          'hideOptionMenu',
          'showOptionMenu',
          'closeWindow'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
  },
  "shareMenu" : { //微信分享
      "onMenuShareAppMessage" : function(configs){
          wx.onMenuShareAppMessage({
            title:  configs.shareTitle, 
            desc:   configs.shareDesc,
            link:   configs.oauthLink,
            imgUrl: configs.shareImgurl,
            success: function () { 
              console.log("成功分享给朋友");
            },
            cancel: function () { 
          
            }
          });
      },
      "onMenuShareTimeline" : function(configs){
          wx.onMenuShareTimeline({
            title:  configs.shareTitle, 
            link:   configs.oauthLink,
            imgUrl: configs.shareImgurl,
            success: function () { 
              console.log("成功分享到朋友圈");
            },
            cancel: function () { 
              
            }
          }); 
      }
  },
  "hideMenuItems" : function(){ //隐藏右上角相应按钮
      wx.hideMenuItems({
          menuList: [
              'menuItem:readMode', // 阅读模式
              'menuItem:openWithQQBrowser',
              'menuItem:openWithSafari',
              'menuItem:originPage',
              'menuItem:share:qq',
              'menuItem:share:weiboApp',
              'menuItem:share:facebook',
              'menuItem:share:QZone',
              'menuItem:copyUrl' // 复制链接
          ],
          success: function(res) {},
          fail: function(res) {}
      });
  }
};
