jQuery(function($){
/*--------------------------上架管理-------------------------------------*/
    var putawayData;
    $(".add_sup_box").hide();
    $('.putaway_box').hide();
    $("#add_supplier").click(function(){
        $(".add_sup_box").show();
    });
    $(".close").click(function(){
        $(".add_sup_box").hide();

    });
    $("#close1").click(function(){
        $('.putaway_box').hide();
        var trs=$('.putaway_box tr')
        for(var i=1; i<trs.length; i++){
            trs[i].remove();
        }
        
    });
    $('.sellGoods').hide();
    $('#sellGoods').click(function(){
        console.log(666)
        $('.sellGoods').show();
        $('#supplier_box').hide();
    })
    $('#putaway').click(function(){
        $('.sellGoods').hide();
        $('#supplier_box').show();
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
            goods_name:$("#linkman_name").val(),
            goods_classify:$("#linkman_tel").val(),
            goods_qty:$("#linkman_position").val(),
            sale_price:$("#clerk_name").val(),
            time:createTime()
        }
       
        $.post(common.baseUrl+"/grounding", msg, function(result){
            console.log(result)
            if(result.status){
                    var $tr = $(`
                        <tr>
                        <td><input type="text" value="${msg.goods_order}"/></td>
                        <td><input type="text" value="${msg.goods_code}"/></td>
                        <td><input type="text" value="${msg.goods_name}"/></td>
                        <td><input type="text" value="${msg.goods_classify}"/></td>
                        <td><input type="text" value="${msg.goods_qty}"/></td>
                        <td><input type="text" value="${msg.sale_price}"/></td>
                       <td>${createTime()}</td>
                        <td><button class="btn btn-default btn-xs revamp" id="revamp">确认</button></td>
                        <td><button class="btn btn-default btn-xs delete" id="delete">删除</button></td>
                        </tr>
                        `)
                $tr.appendTo($("#supplier_box table tbody"));

            }
        });
        $('.add_sup_box').hide();

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
                    <td><input type="text" value="${item.goods_name}"/></td>
                    <td><input type="text" value="${item.goods_classify}"/></td>
                    <td><input type="text" value="${item.goods_qty}"/></td>
                    <td><input type="text" value="${item.sale_price}"/></td>
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
                    goods_name:tdval.eq(2).children().eq(0).val(),
                    goods_classify:tdval.eq(3).children().eq(0).val(),
                    goods_qty:tdval.eq(4).children().eq(0).val(),
                    sale_price:tdval.eq(5).children().eq(0).val(),
                    time:createTime()
                }
            
            console.log(term)
            $.post(common.baseUrl+'/revamp',term, function(result) {
                console.log(result)
            })
        }
    }
    $('#hunt').click(function(){
        $('.putaway_box').show();
        $.post(common.baseUrl+'/hunt',{
            fuzSearch:true,
            info:$('#inputSuccess1').val()
            },function(result){
                // var data = response.data;
                // console.log(result)
                putawayShow(result)
        })
    })

    $('#affirm').click(function(){
        $('.putaway_box').show();
        var gName={goods_name:$('#goodsName').val()};
        var gClass={goods_classify:$('#goodsClass').val()};
        var obj= $('#goodsName').val()==""? gClass : $('#goodsClass').val()=="" ? gName : Object.assign({}, gClass, gName);
        $.post(common.baseUrl+'/putaway',obj, function(result) {
            console.log(result);
            putawayShow(result)
        });
        
    });
    $('.putaway_box').click(function(e){
        if($(e.target).hasClass('btn btn-success btn-xs ss')){
            
            putawayData.forEach(function(item){
                delete item._id;

            })
            
            console.log()
            $.post(common.baseUrl+'/putawaySave', {arr:JSON.stringify(putawayData)}, function(res){
                if(res.status){
                    jia(res);
                }
            })
        }
        if($(e.target).hasClass('del')){
            var idx=$(e.target).parents('tr').index();
            putawayData.splice(idx, 1);
            $(e.target).parents('tr').remove()
        }
    });

    function putawayShow(result){
        if(result.status){
                result.data.forEach(function(item){
                    for(var attr in item){
                        var $tr = $(`
                            <tr>
                            <td><input type="text" value="${item.goods_order}"/></td>
                            <td><input type="text" value="${item.goods_code}"/></td>
                            <td><input type="text" value="${item.goods_name}"/></td>
                            <td><input type="text" value="${item.goods_classify}"/></td>
                            <td><input type="text" value="${item.goods_qty}"/></td>
                            <td><input type="text" value="${item.sale_price}"/></td>

                           <td>${createTime()}</td>
                           <td><button class="btn btn-default btn-xs del" id="del">删除</button></td>
                            `)
                    }
                    $tr.appendTo($("#putaway_table"));
                })
        }else{
            alert('发生错误')
        }
    }
   
    /*--------------------------收银管理-------------------------------------*/
})