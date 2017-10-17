jQuery(function($){

    $(".add_sup_box").hide();
    $("#add_supplier").click(function(){
        $(".add_sup_box").show();
    });
    $(".close").click(function(){
        $(".add_sup_box").hide();
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


        //获取输入框的信息
        var msg = {
            goods_order:$("#sup_name").val(),
            goods_code:$("#sup_address").val(),
            good_name:$("#linkman_name").val(),
            goods_class:$("#linkman_tel").val(),
            goods_qty:$("#linkman_position").val(),
            goods_price:$("#clerk_name").val(),
            time:createTime()
        }
        // console.log(msg)
        //往表格添加一行
        // var $tr = $("<tr/>");
        // for(var attr in msg){
        //     $(`<td></td>`).html(msg[attr]).appendTo($tr);
        // }
        // var $yes_del = $(`<td>
        //     <button class="btn btn-default btn-xs ">确认修改</button></td>
        //     <td><button class="btn btn-default btn-xs">删除</button></td>`).appendTo($tr);
        // $tr.appendTo($("#supplier_box table tbody"));
        $.post(common.baseUrl+"/grounding", msg, function(result){
            console.log(result)
            if(result.status){
                    var $tr = $(`
                        <tr>
                        <td><input type="text" value="${msg.goods_order}"/></td>
                        <td><input type="text" value="${msg.goods_code}"/></td>
                        <td><input type="text" value="${msg.good_name}"/></td>
                        <td><input type="text" value="${msg.goods_class}"/></td>
                        <td><input type="text" value="${msg.goods_qty}"/></td>
                        <td><input type="text" value="${msg.goods_price}"/></td>
                       <td>${createTime()}</td>
                        <td><button class="btn btn-default btn-xs revamp" id="revamp">确认</button></td>
                        <td><button class="btn btn-default btn-xs delete" id="delete">删除</button></td>
                        </tr>
                        `)
                $tr.appendTo($("#supplier_box table tbody"));

            }
        });

    });
    $.post(common.baseUrl+"/create",function(result){
        jia(result)
    })
    function jia(result){
        result.data.forEach(function(item){
            for(var attr in item){
                var $tr = $(`
                    <tr>
                    <td><input type="text" value="${item.goods_order}"/></td>
                    <td><input type="text" value="${item.goods_code}"/></td>
                    <td><input type="text" value="${item.good_name}"/></td>
                    <td><input type="text" value="${item.goods_class}"/></td>
                    <td><input type="text" value="${item.goods_qty}"/></td>
                    <td><input type="text" value="${item.goods_price}"/></td>
                   <td>${createTime()}</td>
                    <td><button class="btn btn-default btn-xs revamp" id="revamp">确认</button></td>
                    <td><button class="btn btn-default btn-xs delete" id="delete">删除</button></td>
                    </tr>
                    `)
            }
            $tr.appendTo($("#supplier_box table tbody"));
        })
        $('.tablebox').click(function(e){
            delete1(e.target);
            revamp(e.target);         
        });
    }
    function delete1(target){
        if(target.id=='delete'){
            var goods_order=$(target).parents('tr').children('td').eq(0).children().eq(0).val()
            $.post(common.baseUrl+'/delete',{goods_order:goods_order}, function(result){
                console.log(result)
                if(result.status){
                    $(target).parents('tr').remove();
                }
            });
        }
    }
    //修改上架信息
    function revamp(target){
        if(target.id=='revamp'){
            var tdval=$(target).parents('tr').children('td')
            console.log(tdval.eq(0).children().eq(0).val());
            var term=
                {
                    goods_order:tdval.eq(0).children().eq(0).val(),
                    goods_code:tdval.eq(1).children().eq(0).val(),
                    good_name:tdval.eq(2).children().eq(0).val(),
                    goods_class:tdval.eq(3).children().eq(0).val(),
                    goods_qty:tdval.eq(4).children().eq(0).val(),
                    goods_price:tdval.eq(5).children().eq(0).val(),
                    time:createTime()
                }
            
            console.log(term)
            $.post(common.baseUrl+'/revamp',term, function(result) {
                console.log(result)
            })
        }
    }
    $('#hunt').click(function(){
        $.post(common.baseUrl+'/hunt', $('#inputSuccess1').val(),function(result){

        })
    })
})