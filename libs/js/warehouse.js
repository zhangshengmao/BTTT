$(function(){

    // $.post("http://10.3.131.22:88/reserve", {username:1}, function(response){
    //     console.log(response);
    // })
    
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

    // --------table插入一条tr
    function Insert(data){
        var tr =  `    
                    <tr>
                        <td><input type="text" class="goods_order" value=${data.goods_order} disabled /></td>
                        <td><input type="text" class="goods_code" value=${data.goods_code} /></td>
                        <td><input type="text" class="goods_name" value=${data.goods_name} /></td>
                        <td><input type="text" class="goods_classify" value=${data.goods_classify} /></td>
                        <td><input type="text" class="goods_qty" value=${data.goods_qty} /></td>
                        <td><input type="text" class="sup_name" value=${data.sup_name} /></td>
                        <td><input type="text" class="prime_price" value=${data.prime_price} /></td>
                        <td><input type="text" class="sale_price" value=${data.sale_price} /></td>
                        <td><input type="text" class="time" value=${data.time} /></td>
                        <td><button class="btn btn-default btn-xs">确认</button></td>
                        <td><button class="btn btn-default btn-xs">删除</button></td>
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
    
    // -----生成表格中的trs
    $.post("http://localhost:88/reserve", {goods_order:''},function(response){
        var data = response.data;
        // console.log(data);
        makeTrs(data);
    });


    // ---------点击添加tr及添加到数据库
    $('.add_info .close').click(function(){
       $('.add_info').css({display:'none'});   
    });
    $('.table .addtr').click(function(){
        $('.add_info').css({display:'block'}); 
    });
    $('#addToDb').click(function(){
       $.post("http://localhost:88/reserve", 
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
            var data = response.data;
            // console.log(data);
            Insert(data);
        });        
    });

    // ------点击删除tr及对应数据库内数据
    $('.table').on('click','.delet',function(){
        var tr = $(this).parent().parent();
        $.post("http://localhost:88/reserve", 
            {goods_order:$(tr).find('.goods_order').val(),delet:true},
            function(response){
            // console.log(response);
            if(response.status){
                $(tr).remove();  
            }
        });
    });

    // ----更新数据事件
    $('.table').on('click','.addTo',function(){
        var tr = $(this).parent().parent();
       $.post("http://localhost:88/reserve", 
        {
            goods_order:$(tr).find('.goods_order').val(),
            goods_code:$(tr).find('.goods_code').val(),
            goods_name:$(tr).find('.goods_name').val(),
            goods_classify:$(tr).find('.goods_classify').val(),
            goods_qty:$(tr).find('.goods_qty').val(),
            sup_name:$(tr).find('.sup_name').val(),
            prime_price:$(tr).find('.prime_price').val(),
            sale_price:$(tr).find('.sale_price').val(),
            time:Time()
        },
        function(response){
            // var data = response.data;
            // console.log(data);
        });          
    });

    // ------精确查找
    $('.toSearch').click(function(){
       $.post("http://localhost:88/reserve", 
        {
            cerSearch:true,
            prime_priceMin:$('#pur1').val(),
            prime_priceMax:$('#pur2').val(),
            sale_priceMin:$('#sel1').val(),
            sale_priceMax:$('#sel2').val(),
            goods_qtyMin:$('#amo1').val(),
            goods_qtyMax:$('#amo2').val(),
            goods_classify:$('#ser_classify').val(),
            sup_name:$('#ser_firms').val()      
        },
        function(response){
            var data = response.data;
            // console.log(response);
            makeTrs(data);
        });     

    });

    // ------模糊搜索
    $('.fuzSearch').click(function(){
        $.post("http://localhost:88/reserve",
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