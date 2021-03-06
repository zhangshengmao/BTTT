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
                            <td><input type="text" class="goods_order" value=${item.goods_order} disabled /></td>
                            <td><input type="text" class="goods_code" value=${item.goods_code} /></td>
                            <td><input type="text" class="goods_name" value=${item.goods_name} /></td>
                            <td><input type="text" class="goods_classify" value=${item.goods_classify} /></td>
                            <td><input type="text" class="goods_qty" value=${item.goods_qty} /></td>
                            <td><input type="text" class="sup_name" value=${item.sup_name} /></td>
                            <td><input type="text" class="prime_price" value=${item.prime_price} /></td>
                            <td><input type="text" class="sale_price" value=${item.sale_price} /></td>
                            <td><input type="text" class="time" value=${item.time} /></td>
                            <td><button class="btn btn-default btn-xs addTo">确认</button></td>
                            <td><button class="btn btn-default btn-xs delet">删除</button></td>
                        </tr>`
        }).join('');
        $('.table tbody').html(trs);
    }


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
        url:baseUrl + '/reserve',
        cols:'goods_order,goods_code,goods_name,goods_classify,goods_qty,sup_name,prime_price,sale_price,time',
        method:'post',
        edit:true,
        delete:true,
        insert:true,
        info:{goods_order:''},
        caption:'库存管理表'
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
       $.post(postUrl, 
        {
            goods_order:$('#order').val(),
            goods_code:$('#code').val(),
            goods_name:$('#goods_name').val(),
            goods_classify:$('#classify').val(),
            goods_qty:$('#qty').val(),
            sup_name:$('#sup_name').val(),
            prime_price:$('#prime_price').val(),
            sale_price:$('#sale_price').val(),
            time:Time()
        },
        function(response){
            console.log(response);
            $('.tableBox').html('');
            $('.tableBox').datagrid({
                url:baseUrl + '/reserve',
                cols:'goods_order,goods_code,goods_name,goods_classify,goods_qty,sup_name,prime_price,sale_price,time',
                method:'post',
                edit:true,
                delete:true,
                insert:true,
                info:{goods_order:''},
                caption:'库存管理表'
            })           
        });        
    });


    // ------模糊搜索
    $('.fuzSearch').click(function(){
        $.post(baseUrl + '/reserve',
        {
            fuzSearch:true,
            info:$('.fuzInput').val()
        },
        function(response){
            var data = response.data;
            makeTrs(data);
        })
    });
    
    
});