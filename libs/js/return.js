$(function(){


    // $.post("http://10.3.131.22:88/reserve", {username:1}, function(response){
    //     console.log(response);
    // })
    common.navigationBars();
    $("#header").load("base.html .h");
    $("#footer").load("base.html .f");
    // ---------定义baseURL路径
    var baseUrl = "http://localhost:88";

    common.identity();   
    


    // -------生成table中的trs
    function makeTrs(data){
        var trs = data.map(function(item){
                return `    
                        <tr>
                            <td><input type="text" class="goods_order" value=${data.goods_order} disabled /></td>
                            <td><input type="text" class="goods_name" value=${data.goods_name} /></td>
                            <td><input type="text" class="goods_classify" value=${data.goods_classify} /></td>
                            <td><input type="text" class="sup_name" value=${data.sup_name} /></td>
                            <td><input type="text" class="goods_qty" value=${data.return_qty} /></td>
                            <td><input type="text" class="time" value=${data.time} /></td>
                            <td><button class="btn btn-default btn-xs return">退货</button></td>
                        </tr>`
        }).join('');
        $('.table tbody').html(trs);
    }

    // --------table插入一条tr
    function Insert(data){
        var tr =  `    
                    <tr>
                        <td><input type="text" class="goods_order" value=${data.goods_order} disabled /></td>
                        <td><input type="text" class="goods_name" value=${data.goods_name} /></td>
                        <td><input type="text" class="goods_classify" value=${data.goods_classify} /></td>
                        <td><input type="text" class="sup_name" value=${data.sup_name} /></td>
                        <td><input type="text" class="goods_qty" value=${data.return_qty} /></td>
                        <td><input type="text" class="time" value=${data.time} /></td>
                        <td><button class="btn btn-default btn-xs return">退货</button></td>
                        
                    </tr>`;
        $('.table tbody').append(tr);
    };

    // time生成函数
    function Time(){
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var date = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        return(year + '-' + mon + '-' + date + '-' + hour + ':' + min);
    }

    
    $('.tableBox').datagrid({
        url:baseUrl + '/return',
        cols:'goods_order,goods_name,goods_classify,sup_name,return_qty,time',
        method:'post',
        return:true,
        insert:true,
        delete:true,
        edit: true,
        info:{goods_order:''},
        caption:'退货管理表'
    })
    


    // ---------点击添加tr及添加到数据库
    $('.add_info .close').click(function(){
       $('.add_info').css({display:'none'});   
    });

    $('#addToDb').click(function(){
        if($('#order').val() == null || $('#order').val()== undefined || $('#order').val() == ''){
            alert('不能为空');
            return false;    
        }
       $.post(baseUrl + '/return', 
        {
            goods_order:$('#order').val(),
            goods_name:$('#goods_name').val(),
            goods_classify:$('#classify').val(),
            sup_name:$('#sup_name').val(),
            return_qty:$('#return_qty').val(),
            time:Time()
        },
        function(response){
            // console.log(response);
            $('.tableBox').html('');
            $('.tableBox').datagrid({
                url:baseUrl + '/return',
                cols:'goods_order,goods_name,goods_classify,sup_name,return_qty,time',
                method:'post',
                return:true,
                insert:true,
                delete:true,
                edit: true,
                info:{goods_order:''},
                caption:'退货管理表'
            })
        });        
    });
// ---------确认退货
    $('.tableBox').on('click','.return',function(){
            var $btn_return = $(this);
            var tr = $btn_return.parent().parent();

            $.post(baseUrl + '/reserve', 
            {
                return:true,
                goods_order:$(tr).children().eq(0).children().val(),
                goods_name:$(tr).children().eq(2).children().val(),
                goods_classify:$(tr).children().eq(3).children().val(),
                sup_name:$(tr).children().eq(5).children().val(),
                return_qty:$(tr).children().eq(4).children().val(),
                time:Time()
            },
            function(response){
                // console.log(response)
                if(response.message == '商品不存在'){
                    alert(response.message);
                    return false;
                }else if(response.message == '库存不足'){
                    alert(response.message);
                    return false;
                }else{

                    $btn_return.attr({disabled:true});
                    $.post(baseUrl + '/return',
                        {goods_order:$(tr).children().eq(0).children().val(),
                        delet:true},
                        function(response){
                            console.log(response)
                    });  
                }
            });          
    });

    // ------模糊搜索
    $('.fuzSearch').click(function(){
        $.post(baseUrl + '/return',
        {
            fuzSearch:true,
            info:$('.fuzInput').val()
        },
        function(response){
            var data = response.data;
            makeTrs(data);
        })
    });
    
    
    // // ------精确查找
    // $('.toSearch').click(function(){
    //    $.post(postUrl, 
    //     {
    //         cerSearch:true,
    //         prime_priceMin:$('#pur1').val(),
    //         prime_priceMax:$('#pur2').val(),
    //         sale_priceMin:$('#sel1').val(),
    //         sale_priceMax:$('#sel2').val(),
    //         goods_qtyMin:$('#amo1').val(),
    //         goods_qtyMax:$('#amo2').val(),
    //         goods_classify:$('#ser_classify').val(),
    //         sup_name:$('#ser_firms').val()      
    //     },
    //     function(response){
    //         var data = response.data;
    //         // console.log(response);
    //         makeTrs(data);
    //     });     

    // });
});

