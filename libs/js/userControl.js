jQuery(function($){
    $('.add_user').hide();
    $('#showHide').click(function(){
        $('.add_user').show();
    })
    $('.close').click(function(event) {
        $('.add_user').hide();
    });
    function createTime(){
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
    $("#addToDb").click(function(){
        var msg = {
            username:$('#username').val(),
            password:$('#password').val(),
            identity:$('#identity').val(),
            tel:$('#tel').val(),
            e_mail:$('#e_mail').val(),
            createTime:createTime(),
            time:createTime()
        };
        $.post(common.baseUrl+"/userControl" , msg, function(res){
            if(res.status){
                console.log(res)
                createElemet(res)
            }else{
                alert(res.message)
            }
        })
    })
    function createElemet(res){
        // function jia(result){
        var $tr = $(`
            <tr>
            <td>${res.data.goods_order}</td>
            <td><input type="text" value="${res.data.goods_code}"/></td>
            <td><input type="text" value="${res.data.goods_name}"/></td>
            <td><input type="text" value="${res.data.goods_classify}"/></td>
            <td><input type="text" value="${res.data.goods_qty}"/></td>
            <td><input type="text" value="${res.data.sale_price}"/></td>
           <td>${createTime()}</td>
            <td><button class="btn btn-default btn-xs revamp" id="revamp">确认</button></td>
            <td><button class="btn btn-default btn-xs delete" id="delete">删除</button></td>
            </tr>
            `)

        $tr.appendTo($("table table-bordered table-hover"));
    }

})