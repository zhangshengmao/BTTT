var common = common || {};
common.baseUrl = 'http://10.3.131.14:88';
common.navigationBars = function(){
    $('#bigul').click(function(e){
        if($(e.target).hasClass('anim')){
            console.log($(e.target).next().children().length);
            $('.smallul').animate({height:0},100);
            $(e.target).next().animate({height:60*$(e.target).next().children().length},50);
        }
    })
}
common.createTime=function (){
        //创建当前时间
        var now = new Date();
        //获取日期
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var date = now.getDate();
        var week_str = ['星期日', '星期一','星期二','星期三','星期四','星期五','星期六'];
        var week = now.getDay();

        //获取时间
        var hour = now.getHours();
        var min = now.getMinutes();
        var sec = now.getSeconds();
        var mydate = year + "-" + month  + "-" + 
        date + " " + hour + ":" + min + ":" + sec;
        return mydate;
    }
