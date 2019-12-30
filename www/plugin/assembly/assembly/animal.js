"use strict";//严格模式
typeof(Class) == "undefined" ? (typeof(loadJS) == "undefined" ? alert('动态加载文件 丢失') : loadJS.use(['oop'])) : loadJS.use(['oop']);

var Animal = Class.extend({
    init: function (opts) {
        this.msg = opts.msg;
        this.type = "animal";
    },
    say: function () {
        alert(this.msg + ":i am a " + this.type)
    }
});


//继承Animal，并且混入一些方法
var Dog = Animal.extend({
    init: function (opts) {
        //并未实现super方法，直接简单使用父类原型调用即可
        Animal.prototype.init.call(this, opts);
        //修改了type类型
        this.type = "dog";
    }
});
