/* eslint-disable */
/**
 * @author WSTC
 * @date 2018/9/23 23:46
 * @des 常用函数
 */

!function (e) {
    e.hcCFun = {
        /**
         * @des 直接获得参数（需要提前配置）
         * @returns {string}
         */
        server: '/',

        /**
         * @param val
         * @returns {boolean}
         * @des 判断是否为空
         */
        isNull: function (val) {
            return (val === null || val === undefined || val === "");
        },

        /**
         * @des 判断对象是否为空
         * @param obj
         * @returns {boolean}
         */
        isEmptyObject: function (obj) {
            for(var i in obj){
                if(obj.hasOwnProperty(i)){
                    return false;
                }
            }
            return true;
        },

        /**
         * @des 创建对象 (方便后期扩展 引入设计模式)
         * @returns {e}
         */
        D: function () {
            if(arguments[0] instanceof Function){
                if(arguments[1])//参数
                    return new arguments[0](arguments[1]);
                else
                    return new arguments[0];
            }else console.log('创建对象错误');
        },

        /**
         * @des 获得更目录
         * @returns {string}
         */
        getRootPath: function () {
            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083
            var localhostPast = curWwwPath.substring(0, pos);
            //获取带"/"的项目名，如：/uimcardprj
            // var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            return (localhostPast);
        },

        /**
         * @des 发起请求
         * @returns {*}
         * @constructor
         */
        getHttpRequest : function (){
            if ( window.XMLHttpRequest ) // Gecko
                return new XMLHttpRequest() ;
            else if ( window.ActiveXObject ) // IE
                return new ActiveXObject("MsXml2.XmlHttp") ;
        },

        /**
         * @des ajax 入口
         * @param success Function 回调函数
         * @param url String 地址
         * @param method String 传输类型
         * @param async String 同步/异步
         * @param data String 参数
         * @param mask ele 遮罩元素
         * @param beforeRun Function 开始之前执行
         * @param endRun Function 开结束之前执行
         * @param error Function 状态码错误回调函数
         * @param withCredentials boolean  跨域类型时是否在请求中协带cookie 当配置了xhr.withCredentials = true时，必须在后端增加 response 头信息Access-Control-Allow-Origin，且必须指定域名，而不能指定为*。
         * @constructor
         */
        ajaxPage : function (success, url, method, data, async, mask, beforeRun, endRun, error, withCredentials){
            if(url){
                method = method || 'GET';
                data = data || '';
                async = (async !== false);
                withCredentials  = withCredentials || false;
                mask = mask?document.querySelector(mask):null;
                mask &&  (mask.style.display = 'block');
                //Todo ajax开始之前加入执行的代码
                (beforeRun) && (beforeRun());
                var oXmlHttp = hcCFun.getHttpRequest() ;
                oXmlHttp.withCredentials = withCredentials;
                oXmlHttp.onreadystatechange  = function(){
                    if ( oXmlHttp.readyState === 4 ){
                        if ( oXmlHttp.status === 200 || oXmlHttp.status === 304 )
                            (success instanceof Function) && success(oXmlHttp.responseText);
                        else
                            ((error instanceof Function) && error(oXmlHttp.responseText)) || hcCFun.ajaxError(oXmlHttp.responseText);

                        //Todo ajax结束加入加入代码
                        endRun && (endRun());
                        mask &&  (mask.style.display = 'none');
                        console.log(oXmlHttp.responseText);
                    }
                };
                oXmlHttp.open(method, url, async);
                oXmlHttp.send(data);
            }else console.log('file: CommFun.js, method: ajaxPage, con: 路径找不到');
        }

        /**
         * @des ajax 状态码的默认值 （默认是 json）
         */
        ,ajaxError: function(responseText){
            var response = JSON.parse(responseText);
            switch (response.code){
                case(500):
                    alert("服务器系统内部错误");
                    break;
                case(401):
                    window.localStorage && window.localStorage.setItem("visitURL",window.document.location.href);
                    parent.window.location.href = '/login.html';
                    break;
                case(403):
                    alert("无权限执行此操作");
                    break;
                case(408):
                    alert("请求超时");
                    break;
                default:
                    alert("未知错误");
            }
        }

        /**
         * @des 获得get参数$_GET()['参数']
         * @returns {{}}
         */
        ,$_GET: function(){
            var url = window.document.location.href.toString();
            var u = url.split("?");
            if(typeof(u[1]) === "string"){
                u = u[1].split("&");
                var get = {};
                for(var i in u){
                    var j = u[i].split("=");
                    get[j[0]] = j[1];
                }
                return get;
            } else {
                return {};
            }
        }

        /**
         * @des html字符串转换为 HTML 实体
         * @param str
         * @returns {string}
         */
        ,htmlSpecialChars: function (str){
            var s = "";
            if (str.length == 0) return "";
            for   (var i=0; i<str.length; i++)
            {
                switch (str.substr(i,1))
                {
                    case "<": s += "&lt;"; break;
                    case ">": s += "&gt;"; break;
                    case "&": s += "&amp;"; break;
                    case " ":
                        if(str.substr(i + 1, 1) == " "){
                            s += " &nbsp;";
                            i++;
                        } else s += " ";
                        break;
                    case "\"": s += "&quot;"; break;
                    case "\n": s += "<br>"; break;
                    default: s += str.substr(i,1); break;
                }
            }
            return s;
        }

        /**
         * @des 得到简介
         * @param str
         * @param length
         * @returns {*}
         */
        ,introduction: function (str, length) {
            if(str){
                str = hcCFun.htmlSpecialChars(str);
                length = length || 150;//默认150字符
                //需要过滤的关键字
                var filtersArr = ["/<[^>]+>/", '&nbsp;', '<br>', '\r', '\n'];
                var reg = '';
                for(var i=0; l=filtersArr.length,i<l;i++){
                    reg = new RegExp(filtersArr[i], "g" );
                    str = str.replace(reg,'');
                }
                str = str.trim();
                str = str.substr(0,length);
                return str;
            }
        }

        /**
         * @des 时间格式化处理
         * @param fmt yyyy-MM-dd hh:mm:ss
         * @param date new Date(value);
         * @returns {*}
         */
        ,dateFtt: function (fmt,date){
            var o = {
                "M+" : date.getMonth()+1,                 //月份
                "d+" : date.getDate(),                    //日
                "h+" : date.getHours(),                   //小时
                "m+" : date.getMinutes(),                 //分
                "s+" : date.getSeconds(),                 //秒
                "q+" : Math.floor((date.getMonth()+3)/3), //季度
                "S"  : date.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        }

        /**
         * @des 是否是移动端
         * @returns {boolean}
         */
        ,isMobile: function () {
            return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        }

        /**
         * @des 高度自适应 （同域）
         * @param obj iframe js对象
         */
        ,iframeAutoHeight: function (obj) {
            if (obj) {
                var iframeWin = obj.contentWindow || obj.contentDocument.parentWindow;
                if (iframeWin.document.body) {
                    obj.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
                }
            }console.log('iframeAutoHeight 错误');
        }

        /**
         * @des 对象方法延迟调用
         * @param obj 包含方法的对象
         * @param funName 包含的方法名
         * @param fun 方法
         * @param delayTime 延迟时间
         */
        , delayCall: function (obj, funName, fun, delayTime) {
            delayTime = delayTime || 10;
            if(obj && funName && fun instanceof Function) {
                var flagName = funName + Math.floor((Math.random()*1000));
                eval(flagName + " = setInterval(function () {" +
                        "if(obj.hasOwnProperty(funName)) {" +
                            "fun();" +
                            "clearInterval( " + flagName + " );" +
                        "}" +
                    "}, delayTime);");
            } else
                console.log('方法delayCall 参数错误')
        }

    }
}(window);
