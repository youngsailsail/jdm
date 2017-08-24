/**
 * Created by Administrator on 2017/6/14.
 */

window.mjd = {};


/* 自定义click -- tap */
// obj 代表触发tap的标签,也就是tap添加到谁身上
// 当用户点击obj时候,会触发callback中的 业务
// 1.只要touchmove触发了,就不会触发click
// 2.touchend - touchstart:之间的差值小于300ms的时候,才会触发click
mjd.tap = function (obj, callback) {
    if (typeof (obj) != 'object') {
        'error: obj is undefined!!!!!~~~!!!'
        return;
    }

    // 时间差的常量
    var duration = 300;

    var isMoved = false;
    var startTS = 0;


    obj.addEventListener('touchstart', function (e) {
        startTS = Date.now();
    });
    obj.addEventListener('touchmove', function (e) {
        e.preventDefault();
        isMoved = true;
    });
    obj.addEventListener('touchend', function (e) {
        // 符合两个条件,才会调用callback
        if ((isMoved == false) && (Date.now() - startTS < duration)){
            if (callback){
                callback(e);
            }
        }

        // 数据还原
        isMoved = false;
        startTS = 0; // optional
    });
}


/*
 * 快捷栏出现与消失
 * */
function changeShortcutState() {
    // 1.拿标签
    var base_header = document.getElementsByClassName('jd_base_header')[0];
    var btn = base_header.getElementsByClassName('icon_shortcut')[0];
    var shortcut = base_header.getElementsByClassName('shortcut')[0];

    // 添加点击事件
    mjd.tap(btn, function (e) {

        // 2.获取相关参数
        var shortcut_display_str = shortcut.style.display;
        // console.log('console.log(e); ',shortcut_display_str);
        // notice: 如果要获取元素的style的dispaly,需要在h5页面中的标签内,写它的style才能get到
        // 3.切换显示效果
        if (shortcut_display_str == 'table'){
            shortcut.style.display = 'none';
        }else if(shortcut_display_str == 'none'){
            shortcut.style.display = 'table';

        }
    });


}