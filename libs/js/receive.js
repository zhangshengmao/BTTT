$(function(){


    // $.post("http://10.3.131.22:88/reserve", {username:1}, function(response){
    //     console.log(response);
    // })
     
    common.navigationBars();
    $("#header").load("base.html .h");
    $("#footer").load("base.html .f");
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
                            <td><button class="btn btn-default btn-xs receive">收货</button></td>
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
        url:baseUrl + '/search_purchase',
        cols:'goods_order,goods_code,goods_name,goods_classify,goods_qty,sup_name,prime_price,sale_price,time',
        method:'post',
        receive:true,
        info:{goods_order:''},
        caption:'收货管理表'
    })

// ---------确认收货
    $('.tableBox').on('click','.receive',function(){
            var $btn_receive = $(this);
            var tr = $btn_receive.parent().parent();

            $.post(baseUrl + '/reserve', 
            {
                goods_order:$(tr).children().eq(0).children().val(),
                goods_code:$(tr).children().eq(1).children().val(),
                goods_name:$(tr).children().eq(2).children().val(),
                goods_classify:$(tr).children().eq(3).children().val(),
                goods_qty:$(tr).children().eq(4).children().val(),
                sup_name:$(tr).children().eq(5).children().val(),
                prime_price:$(tr).children().eq(6).children().val(),
                sale_price:$(tr).children().eq(7).children().val(),
                time:Time()
            },
            function(response){
                $btn_receive.attr({disabled:true});
                $(tr).find('.receive').attr({disabled:true});
                $.post(baseUrl + '/delete_purchase',
                    {goods_order:$(tr).children().eq(0).children().val()},
                    function(response){
                        console.log(response)
                });  
            });          
    });
        

    // ------模糊搜索
    $('.fuzSearch').click(function(){
        $.post(baseUrl + '/search_purchase',
        {
            blurSearch2:true,
            info:$('.fuzInput').val()
        },
        function(response){
            var data = response.data;
            $('.table tbody').html();
            makeTrs(data);
           
        })
    });    
    
});