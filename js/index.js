/**
 * Created by Administrator on 2017/6/14.
 */

window.onload = function () {
    // 0.获取所有方法都要用的公共标签和相应其他参数,以参数的形式传递给 fuc(x, y)


// 1..头部透明度:
    changeTopAlpha();
//    2.焦点图
    activeBanner();
//    3..秒杀倒计时
    seckillTimer();


}

window.onresize = function () {
    // 切换设备,让界面刷新
    setTimeout(function () {
        window.location.reload();
    }, 222);
}

/* 头部透明度变化:
* alpha取值范围:[0,0.8]; rgba(201, 21, 35, 0.8);
 UI作用范围: body.scrollTop在[0, bannerH]之间
* */
function changeTopAlpha() {
    // 1.拿到标签
    var topBar = document.getElementsByClassName('jd_tobbar')[0];
    var banner = document.getElementsByClassName('jd_banner')[0];

    // 2.确定要用到的相关参数
    var bannerH = banner.offsetHeight;
    var alpha = 0;
    var maxAlpha = 0.8;
    var scrollTop = 0;

    // 3.在滚动时
    window.onscroll = function () {
        // 3.1 拿到滚动的距离
        scrollTop = document.documentElement.scrollTop;
        // 3.2 根据滚动距离判断当前透明度取值
        if (scrollTop < bannerH){
            alpha = maxAlpha * (scrollTop / bannerH);
        }else {
            alpha = maxAlpha;
        }
        // 3.3 赋值 = 字符串 + 参数 + 字符串 = 新字符串
        topBar.style.background = 'rgba(201, 21, 35, ' + alpha + ')';
    }


}

/*
*焦点图: 业务逻辑主要分两部分

 自动无限轮播:
 1.每duration秒定时器使ul过渡滚动一次,滚动的范围是一个li的宽
 2.过渡结束后:
 index范围判断,若滚动到边界则进行index转移以及非过渡位移
 切换白点

 ----手势滑动----
 1.手势开始时停止计时器
 2.滑动手势期间:
 - 清除默认事件event.preventDefault
 - 非过渡滚动:切换x值=当前x值+movedX
 3.手势结束
 - 根据movedX,确定index--/++or不动,并过渡翻页
 - 重启定时器
 - 数据重置(optional)
*
* */
function activeBanner() {

    // 1.拿到标签
    var banner = document.getElementsByClassName('jd_banner')[0];
    var ul_imgbox = banner.getElementsByTagName('ul')[0];
    var ol_pagebox = banner.getElementsByTagName('ol')[0];
    var imgs = ul_imgbox.getElementsByTagName('li');
    var pages = ol_pagebox.getElementsByTagName('li');
    // 2.获取要用到的相关的参数
    var timer;
    var duration = 1000; // 先假设每秒滚动一次
    var imgW = banner.offsetWidth;
    var imgCount = imgs.length;
    var index = 1; // 当前ul_imgbox中显示的图片是第几张
    var ul_left_x = -index * imgW;

    //3.过渡效果
    //3.1 设置过渡
    var setTransition = function () {
        ul_imgbox.style.transition = 'all .2s ease';
        ul_imgbox.style.webkitTransition = 'all .2s ease';
    };
    // 3.2 移除过渡效果
    var removeTransition = function () {
        ul_imgbox.style.transition = 'none';
        ul_imgbox.style.webkitTransition = 'none';
    };
    // 3.3 水平位移
    var translateX = function (x) {
        ul_imgbox.style.transform = 'translateX(' + x + 'px)';
        ul_imgbox.style.webkitTransform = 'translateX(' + x + 'px)';
    }
    
    // 4.根据定时器,让ul_imgbox动起来
    timer = setInterval(scrollImg, duration);
    function scrollImg() {
        index ++;

        setTransition();
        // 在开发中,尽量不要将计算当成参数传递
        ul_left_x = -index * imgW;
        translateX(ul_left_x);

        // 如果放在此处,会导致过渡效果不太完美
        // keepIndexSafe();
    }

    // 5.监听过渡结束后
    ul_imgbox.addEventListener('transitionend', keepIndexSafe);
    ul_imgbox.addEventListener('webkitTransitionend', keepIndexSafe);
    function keepIndexSafe() {
        // 5.1 查看index是否到了边界[0,9]一共10张
        if (index >= (imgCount - 1)){ // 当滚到最后一张,悄悄的换第二张
            index = 1;
        }else if (index <= 0){ // 当滚到第一张的时候,悄悄的换倒数第二张
            index = (imgCount - 2);
        }
        // 5.2 非过渡位移(悄悄的换)
        removeTransition();
        ul_left_x = -index * imgW;
        translateX(ul_left_x);

        // 5.3 小白点跟着变
        changeCurPage();
    }

    // 6.curPage小白点,跟着index变
    function changeCurPage() {
        // 1.取消之前的选中
        for (var i = 0; i < pages.length; i++){
            pages[i].className = '';
        }
        // 2.显示当前的选中(需要注意,方法的执行,必须放在index安全范围内)
        pages[index - 1].className = 'current';
    }

/*****手势滑动*****/

    // 0. 用到的参数
    var startX, movingX, changedX;

    startX = 0;
    movingX = 0;
    changedX = 0;
    var temp_ul_leftX = 0;

    // 1.开始手势
    ul_imgbox.addEventListener('touchstart', function (e) {
        // 1.1 清空定时器
        clearInterval(timer);
        // 1.2 记录startX
        startX = e.touches[0].clientX;
    });
    // 2.手势滑动期间
    ul_imgbox.addEventListener('touchmove', function (e) {
        e.preventDefault(); // 记住作用
        // 2.1 记录x
        movingX = e.touches[0].clientX;
        changedX = movingX - startX;

        // 2.2 让ul跟随手势进行位移
        removeTransition();
        temp_ul_leftX = ul_left_x + changedX;
        translateX(temp_ul_leftX);
    })
    // 3.手势结束
    ul_imgbox.addEventListener('touchend', function (e) {
        // 3.1 让不显示整页的img过渡回整页
        if (changedX > imgW * 0.49){ // 向右移动超过一半的时候,向右翻页,也就是index--
            index--;
        }else if(changedX < -imgW * 0.49){// 向left移动超过一半的时候,向left翻页,也就是index+1
            index++;
        }else { // 回到当前的整页
        }
        setTransition();
        ul_left_x = -index * imgW;
        translateX(ul_left_x);

        // 3.2 重启定时器
        timer = setInterval(scrollImg, duration);

        // 3.3 让参数恢复(optional)
        startX = 0;
        movingX = 0;
        changedX = 0;
        temp_ul_leftX = 0;
    })
}

/*
*假设 每天3场抢购 0点场 8点场 16点场
 当前处于 1.x点场 2.离下一场还剩多少时间 3.每秒展示一次
 当前处于8点场 , 16
 15:00:00
 01:00:00

 15:01:00
 00:59:00

 15:02:03
 00:57:57

* */
function seckillTimer() {

    // 1.获取标签
    var seckill_left_link = document.getElementsByClassName('seckill_left_link')[0];
    var em_nth = seckill_left_link.getElementsByTagName('em')[0];
    var spans = seckill_left_link.getElementsByTagName('span');

    // 2.获取相关参数
    var duration_nth = 8; // 每8小时一场
    var nth = 0; // 当前是第几场

    var timer = setInterval(function () {
        var now = new Date();
        var now_h = now.getHours();
        var now_m = now.getMinutes();
        var now_s = now.getSeconds();

        var left_h = 0;
        var left_m = 0;
        var left_s = 0;
        // console.log(now);
        // console.log(now_h, now_m, now_s);
        if (now_h >=0 && now_h < 8){
            nth = 0;
            left_h = (now_m == 0 && now_s == 0) ? 8 - now_h: 7 - now_h;
        }else {
            nth = Math.floor(now_h/duration_nth) * duration_nth;
            left_h =  (now_m == 0 && now_s == 0) ? (nth + duration_nth) - now_h: (nth + duration_nth - 1) - now_h;
        }

        left_m = (now_s == 0) ? 60 - now_m: 59 - now_m;
        left_s = (now_s == 0) ? 0: 60 - now_s;

        em_nth.innerHTML = nth;
        spans[1].innerHTML = left_h;
        spans[3].innerHTML = Math.floor(left_m/10);
        spans[4].innerHTML = left_m % 10;
        spans[6].innerHTML = Math.floor(left_s/10);
        spans[7].innerHTML = left_s % 10;


    }, 1000);
}