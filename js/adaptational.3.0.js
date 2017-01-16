// no jquery
(function() {
    window.DEVTOOL = window.DEVTOOL || {};
    DEVTOOL.init = {
        // wWidth : this.windowWidth(),
        // wHeight : this.windowHeight(),
        load: function(fn) {
            var oldload = window.onload;
            if (typeof oldload !== 'function') {
                window.onload = function() { fn(); };
            } else {
                window.onload = function() {
                    oldload();
                    fn();
                    console.log("onload event")
                }
            }
            // console.log("load",this)
            return this;
        },
        windowHeight: function() {
            var myHeight = 0;
            if (typeof(window.innerHeight) == 'number') {
                //Non-IE  
                myHeight = window.innerHeight;
            } else if (document.documentElement && (document.documentElement.clientHeight)) {
                //IE 6+ in 'standards compliant mode'  
                myHeight = document.documentElement.clientHeight;
            } else if (document.body && (document.body.clientHeight)) {
                //IE 4 compatible  
                myHeight = document.body.clientHeight;
            }
            return parseInt(myHeight);
        },
        windowWidth: function() {
            var myWidth = 0;
            if (typeof(window.innerWidth) == 'number') {
                //Non-IE  
                myWidth = window.innerWidth;
            } else if (document.documentElement && (document.documentElement.clientWidth)) {
                //IE 6+ in 'standards compliant mode'  
                myWidth = document.documentElement.clientWidth;
            } else if (document.body && (document.body.clientWidth)) {
                //IE 4 compatible  
                myWidth = document.body.clientWidth;
            }
            return parseInt(myWidth);
        },
        autorun: function() {
            var default_font_size = 20; //默认字号
            var default_wh_4v3 = 1.33; //默认屏宽高比Number((4/3).toFixed(2))
            var default_wh_16v9 = 1.78; //默认屏宽高比16/9
            var default_wh_21v9 = 2.33; //默认屏宽高比21/9
            var default_font_Hscale = 0.0417; //默认缩放比iphone4横
            var default_font_Pscale = 0.0625; //默认缩放比iphone4竖
            //dpr倍数
            var dpr = window.devicePixelRatio;
            var htmlObj = document.querySelector("html");
            var wWidth = DEVTOOL.init.windowWidth();
            var wHeight = DEVTOOL.init.windowHeight();
            //浏览器宽
            var win_width = parseInt(wWidth);
            //浏览器高
            var win_height = parseInt(wHeight);
            console.info(wWidth, "<--wwidth;wheight-->" + wHeight)
                //实际屏宽高比
            var win_wh = Number((win_width / win_height).toFixed(2));

            //是否横屏
            var isH = win_wh > 1 ? true : false;

            //Html样式
            var html_style = '';

            //Body样式
            var body_style = '';

            //计算
            if (isH) { //手机或PC横屏
                if (win_wh >= default_wh_4v3) {
                    // console.log('手机或PC横屏A');
                    var f = win_height * 1.33 * default_font_Hscale;
                    html_style = 'font-size:' + f + 'px';
                } else {
                    // console.log('手机或PC横屏B');
                    var f = win_width * default_font_Hscale;
                    html_style = 'font-size:' + f + 'px';
                }
            } else { //手机或PC竖屏
                // console.log('手机或PC竖屏');
                var f = win_width * default_font_Pscale;
                html_style = 'font-size:' + f + 'px';
            }
            //进行dom操作
            htmlObj.setAttribute('style', html_style);

            //$("body").attr('style', body_style);

        },
        getParam: function(param) {
            var param = param;
            // if ($) {
            //     $.getUrlParam = function(param) {
            //         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            //         var r = window.location.search.substr(1).match(reg);
            //         if (r != null) return unescape(r[2]);
            //         return null;
            //     }
            // } else {
                    var query = window.location.search; //获取URL地址中？后的所有字符  
                    var iLen = param.length; //获取你的参数名称长度  
                    var iStart = query.indexOf(param); //获取你该参数名称的其实索引  
                    if (iStart == -1) //-1为没有该参数  
                        return "";
                    iStart += iLen + 1;
                    var iEnd = query.indexOf("&", iStart); //获取第二个参数的其实索引  
                    if (iEnd == -1) //只有一个参数  
                        return query.substring(iStart); //获取单个参数的参数值  
                    return query.substring(iStart, iEnd); //获取第二个参数的值  
                
            // }
        },
        sgSession:function(item,value){
            if (val) {
                // if (val instanceof Object) {
                //   val = JSON.stringify(val)
                // };
                sessionStorage.setItem(name, val);
            } else {
                if (val === "") {
                    sessionStorage.removeItem(name);
                } else {
                    if (sessionStorage[name]) {
                        return sessionStorage.getItem(name);
                    } else {
                        return "";
                    }
                }
            }
        }
    }
    return DEVTOOL;
}(window)).init.load(function() {
    DEVTOOL.init.autorun();
    window.onresize = window.onload;
})
