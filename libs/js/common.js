var common = common || {};
common.baseUrl = 'http://10.3.131.14:88';
common.ip="10.3.131.14";
common.navigationBars = function(){
    $('#bigul').click(function(e){

        if($(e.target).hasClass('anim')){
            $('.smallul').animate({height:0},100);
            if($(e.target).next().height()==0){
                $(e.target).next().animate({height:60*$(e.target).next().children().length},50);
            }else{
                $(e.target).next().animate({height:0*$(e.target).next().children().length},50);
            }
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
    // $.post(baseUrl + '/reserve', 
    //         {
    //             return:true,
    //             goods_order:$(tr).children().eq(0).children().val(),
    //             goods_name:$(tr).children().eq(2).children().val(),
    //             goods_classify:$(tr).children().eq(3).children().val(),
    //             sup_name:$(tr).children().eq(5).children().val(),
    //             return_qty:$(tr).children().eq(4).children().val(),
    //             time:Time()
    //         },
    //         function(response){