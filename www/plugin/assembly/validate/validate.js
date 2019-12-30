/**
 * @Author:      WSTC
 * @DateTime:    2018/9/23 23:16
 * @Description: 验证
 * @version:     1.0
 */

!function (e) {

    e.hcValid = {};
    typeof(loadJS)=="undefined"?alert('动态加载文件 丢失'):loadJS.use(['commReg']);

    /**
     * @des 效验字符串格式
     * @param token string 效验的规则sign
     * @param val string 效验的字符串
     * @returns {boolean}
     */
    hcValid.reg = function (token ,val) {
        if(!hcCommFun.isNull(token) && !hcCommFun.isNull(val)){
            if(hcValid.CommReg.hasOwnProperty(token)){
                var Txt = eval('hcValid.CommReg.'+token+'()');
                if(!hcCommFun.isNull(Txt)){
                    return hcValid.test(Txt,val);
                }else{
                    console.log('找不到正则内容！');
                }
            }else{//not exist
                console.log('待开发ing');
            }
        }else{
            console.log('参数错误！');
        }
    };

    /**
     * @des 正则匹配
     * @param Txt 正则规则
     * @param val 效验字符串
     * @returns {boolean}
     */
    hcValid.test = function (Txt,val) {
        var reg = new RegExp(Txt);
        return reg.test(val);
    };
}(window);

