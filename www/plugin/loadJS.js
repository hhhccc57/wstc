/* eslint-disable */
"use strict";//严格模式
/**
 * @author WSTC
 * @date 2019/01/18 11:04
 * @des 统一加载模块
 * @version 2.0
 * @改动
 * 自定义同步异步（默认异步 true）
 * 执行方法H函数在加载完JS模块后自动运行 （多个方法 按加入队列先后顺序执行 采用先进先出原则）
 */


!function (e) {

    e.loadJS = {
        /**
         * @des 动态加载入口
         * @param arguments[0] Array 加载的js
         * @param arguments[1] func 加载完后执行的代码
         */
        use: function () {
            if (arguments[0] instanceof Array) {
                //累计加载模块的数量(与加载次数对比 决定方法执行的时间)
                (!loadJS.loadNum) ? loadJS.loadNum = arguments[0].length : loadJS.loadNum += arguments[0].length;
                //加载多少模块加入队列
                loadJS.modular && arguments[0].push.apply(arguments[0], loadJS.modular);
                loadJS.modular = arguments[0];
                (typeof(loadJS.asyncJS) === 'undefined') && ((arguments[1]===false)?loadJS.asyncJS=false:loadJS.asyncJS=true);//默认是异步
                (typeof(arguments[2]) === 'function') && loadJS.func.push(arguments[2]);//执行方法加入队列
                (!loadJS.loopNum) && (loadJS.loopNum = 0);//加载次数(与加载模块对比 决定方法执行的时间)
                loadJS.onLoad();//加载
            } else console.log('加载参数错误');
        },


        /**
         * @des xhr 加载样式文件
         * param 0：modularCss array 样式文件的数组
         */
        useCss: function () {
            //得到根目录
            var RootPath = loadJS.getRootPath();
            if (arguments[0] instanceof Array) {
                //加载模块加入队列
                loadJS.modularCss && arguments[0].push.apply(arguments[0], loadJS.modularCss);
                loadJS.modularCss = arguments[0];
                //得到根目录
                var currModular = '';
                var pathUrl = '';
                var loop = function () {
                    //这个是加载标记
                    currModular = loadJS.modularCss.shift();
                    //得到配置路径
                    pathUrl = loadJS.config.css(currModular);
                    if (currModular && pathUrl) {
                        var node = document.querySelector("#"+currModular+'Css');
                        if(!node){//防止二次加载
                            loadJS.cssWriteLoad(RootPath + pathUrl, currModular);
                        }else console.log("#"+currModular+'Css已存在');
                        loop();
                    }
                };
                loop();
            } else {
                console.log('加载样式参数错误')
            }
        },


        /**
         * @des 加载text/x-template (vue/react)
         */
        useTemp: function () {
            if (arguments[0] instanceof Array) {
                //复制加载模块
                loadJS.modularTemp && arguments[0].push.apply(arguments[0], loadJS.modularTemp);
                loadJS.modularTemp = arguments[0];
                //Temp 是否异步（默认异步 第一次为准）
                (typeof(loadJS.asyncTemp)==='undefined') && ((arguments[1]===false)?loadJS.asyncTemp=false:loadJS.asyncTemp=true);//默认是异步
                //得到根目录
                var RootPath = loadJS.getRootPath();
                var currModular = '';
                var pathUrl = '';
                var loop = function () {
                    //这个是加载标记
                    currModular = loadJS.modularTemp.shift();
                    //得到配置路径
                    pathUrl = loadJS.config.temp(currModular);
                    if (currModular && pathUrl) {
                        var node = document.querySelector("#"+currModular+'Temp');
                        if(!node){//防止二次加载
                            loadJS.ajaxPage(RootPath + pathUrl, loadJS.asyncTemp, 'temp', currModular);
                            if(loadJS.responseText){
                                loadJS.tempLoad(loadJS.responseText, currModular);
                                loadJS.responseText = '';
                            }
                        }else console.log("#"+currModular+'Temp已存在');
                        loop();
                    }
                };
                loop();
            } else {
                console.log('加载样式参数错误')
            }
        },

        /**
         * @des 加载html（暂停使用） useTemp代替
         */
        useHtml: function () {
            if (arguments[0] instanceof Array) {
                //复制加载模块
                loadJS.modularHtml && arguments[0].push.apply(arguments[0], loadJS.modularHtml);
                loadJS.modularHtml = arguments[0];
                //html 是否异步（默认异步 第一次为准）
                (typeof(loadJS.asyncHtml)==='undefined') && ((arguments[1]===false)?loadJS.asyncHtml=false:loadJS.asyncHtml=true);//默认是异步
                var currModular = '';
                var loop = function () {
                    currModular = loadJS.modularHtml.shift();
                    if (currModular) {
                        loadJS.ajaxPage(currModular, loadJS.asyncHtml);
                        loadJS.responseText = '';
                        loop();
                    }
                };
                loop();
            } else {
                console.log('加载html参数错误')
            }
        }

        /**
         * @des 方法加入队列末尾 并 执行
         */
        ,ready: function () {
            if(typeof(arguments[0]) === 'function'){
                loadJS.func.push(arguments[0]);//执行方法加入队列末尾
                loadJS.runFunc();
            }
        }

        /**
         * @des 方法加入队列头部  并 执行
         */
        ,readyHeader: function () {
            if(typeof(arguments[0]) === 'function'){
                loadJS.func.unshift(arguments[0]);//执行方法加入队列头部
                loadJS.runFunc();
            }
        }

        /**
         * @des 发起请求
         * @returns {*}
         * @constructor
         */
        ,getHttpRequest: function () {
            if (window.XMLHttpRequest) // Gecko
                return new XMLHttpRequest();
            else if (window.ActiveXObject) // IE
                return new ActiveXObject("MsXml2.XmlHttp");
        },

        /**
         * @des ajax 入口
         * @param url String 地址
         * @param async 异步|同步（默认异步）
         * @param type
         * @param currModular
         * @constructor
         */
        ajaxPage: function (url, async, type ,currModular) {
            var oXmlHttp = loadJS.getHttpRequest();
            (async===false)||(async=true);//默认是异步
            oXmlHttp.onreadystatechange = function () {
                if (oXmlHttp.readyState === 4) {
                    if (oXmlHttp.status === 200 || oXmlHttp.status === 304) {
                        if(async){
                            if(type === 'js')
                                loadJS.textLoad(oXmlHttp.responseText, currModular);
                            else if(type === 'temp')
                                loadJS.tempLoad(oXmlHttp.responseText, currModular);
                        }else
                            loadJS.responseText = oXmlHttp.responseText;
                    } else
                        console.log('ajax error: ' + currModular + type);
                }
            };
            oXmlHttp.open('GET', url, async);
            oXmlHttp.send();
        },


        /**
         * @des 挂载文本js
         * @param source ajax加载文本
         * @param sign 模块标记
         * @constructor
         */
        textLoad: function (source, sign) {
            if (source) {
                var oHead = document.getElementsByTagName('HEAD').item(0);
                var oScript = document.createElement("script");
                oScript.language = "javascript";
                oScript.type = "text/javascript";
                oScript.text = source;
                sign && (oScript.id = (sign + 'Js'));
                oHead.appendChild(oScript);
            }
            loadJS.loopNum += 1;
            loadJS.runFunc();
        },

        /**
         * @des 挂载节点script
         * @param url String 地址
         * @param sign 标记
         * @constructor
         */
        elementLoad: function (url, sign) {
            if (url) {
                document.writeln("<script type='text/javascript' src='"+url+"' id='"+(sign + 'Js')+"'></script>");
                document.writeln("<script>loadJS.loopNum += 1;loadJS.runFunc();</script>");
            }else console.log('elementLoad 参数 错误');
        },


        /**
         * @des 挂载节点css
         * @param url String 地址
         * @param sign 标记
         * @constructor
         */
        cssWriteLoad: function (url, sign) {
            if (url) {
                document.writeln("<link type='text/css' rel='stylesheet' href='"+url+"' id='"+(sign + 'Css')+"'>");
            }else console.log('elementLoad 参数 错误');
        },

        /**
         * @des 挂载文本temp(vue)
         * @param source ajax加载文本
         * @param sign 模块标记
         * @constructor
         */
        tempLoad: function (source, sign) {
            if (source) {
                var oHead = document.getElementsByTagName('HEAD').item(0);
                var oScript = document.createElement("script");
                oScript.language = "javascript";
                oScript.type = "text/x-template";
                oScript.text = source;
                sign && (oScript.id = (sign + 'Temp'));
                oHead.appendChild(oScript);
            }
        },


        /**
         * @des js加载完后执行代码
         */
        onLoad: function () {
            //得到根目录
            var RootPath = loadJS.getRootPath();
            //封装成一个方法 确保同步加载
            var allModular = loadJS.modular.shift();

            if(allModular){
                var allModularArr =  allModular.split('|');
                var currModular = allModularArr[0];
                //加载方式 支持2种 js输出法|ajax 默认是 js输出法(推荐 快)
                var method = allModularArr[1];
                //得到配置路径
                var pathUrl = loadJS.config.js(currModular);
                var node = document.querySelector("#"+currModular+'Js');
                if(!node){//防止二次加载
                    //确定已配置
                    if(!method && currModular && pathUrl){
                        loadJS.elementLoad(pathUrl, currModular);
                        loadJS.onLoad();
                    }else if (method === 'xhr' && currModular && pathUrl) {
                        //判断加载方式（根据双方需要保证目录结构）
                        if (loadJS.config.ensureSign().indexOf(currModular) > -1) {
                            loadJS.elementLoad(pathUrl, currModular);
                            loadJS.onLoad();
                        } else {
                            loadJS.ajaxPage(RootPath + pathUrl, loadJS.asyncJS, 'js', currModular);
                            if(loadJS.responseText){
                                loadJS.textLoad(loadJS.responseText, currModular);
                                loadJS.responseText = '';
                            }
                            loadJS.onLoad();
                        }
                    }
                }else{
                    console.log("#"+currModular+'JS已存在');
                    loadJS.loopNum += 1;
                    loadJS.runFunc();
                    loadJS.onLoad();
                }
            }
        }

        /**
         * @des 执行加入数组的方法
         */
        ,runFunc: function () {
            if((loadJS.loopNum === loadJS.loadNum) && loadJS.loopNum>0 && loadJS.loadNum>0){
                //循环执行
                 var loop = function() {
                    if(loadJS.func.length>0){
                        var func = loadJS.func.shift();//console.log(func);
                        (typeof(func) === 'function') && func();
                        loop();
                    }
                };
                loop();
            }
        }

        /**
         * @des 得到跟目录
         * @returns {string}
         */
        ,getRootPath: function () {
            //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
            var curWwwPath = window.document.location.href;
            //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            //获取主机地址，如： http://localhost:8083
            var localhostPaht = curWwwPath.substring(0, pos);
            //获取带"/"的项目名，如：/uimcardprj
            // var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            return (localhostPaht);
        }
    };

    //定义一个参数（不定义的话不晓得这个参数是数组 不能调用push）
    loadJS.func = [];
    window.H = loadJS.ready;
    window.Z = loadJS.readyHeader;

    /**
     * @des 动态加载配置文件
     */
    loadJS.config = {
        /**
         * @des 需要保证目录结构的js集
         * @returns Array
         */
        ensureSign: function () {
            return ['layUI']
        },

        /**
         * @des js
         * @param sign string 标记
         * @returns {*} string url
         */
        js: function (sign) {
            var commFun = '/plugin/assembly/CommFun.js';
            var layUI = '/plugin/layui/layui.js';
            var jq = '/plugin/jquery.min.js';

            try {
                return eval(sign);
            } catch (err) {
                console.log( '加载' + sign + '.js错误');
                return false;
            }
        },

        /**
         * @des css
         * @param sign string 标记
         * @returns {*} string url
         */
        css: function (sign) {
            var layUI = '/plugin/layui/css/layui.css';
            var animate = '/plugin/animate.css';

            try {
                return eval(sign);
            } catch (err) {
                console.log( '加载' + sign + '.css错误');
                return false;
            }
        },

        /**
         * @des 加载text/x-template (vue)
         * @param sign
         * @returns {*}
         */
        temp: function (sign) {
            var header = '/vuecomps/header/index.temp.html';

            try {
                return eval(sign);
            } catch (err) {
                console.log( '加载' + sign + '.template错误');
                return false;
            }
        }
    }
}(window);
