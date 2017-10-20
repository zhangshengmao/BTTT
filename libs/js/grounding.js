jQuery(function($){

    $("#header").load("base.html .h");
    $("#footer").load("base.html .f");

    var token = '';
    var cookies = document.cookie;
    var arr_cookie = cookies.split('; '); 
    arr_cookie.forEach(function(item){ 
        var temp = item.split('=');
        if(temp[0] === 'token'){
            token = temp[1];
        }
    });
    if(token === ''){
        alert('请先登录');
        window.location.href= "login.html";        
    }
    $.post('http://localhost:88/login',{token:token},function(response){
       
        if(!response.status){
            alert('请先登录');
            window.location.href= "login.html";
        }else{
           
            var username = response.username;
            $("#currUser").text(username);
        }
    });   


    
/*--------------------------上架管理-------------------------------------*/
    // 设置全局变量接受仓库数据
    var putawayData;
    // 关于高亮
    
    // 关于显示和隐藏
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
        $('#sellGoods').css({background:'#ccc'})
        $('#putaway').css({background:'#fff'})
        $('.sellGoods').show();
        $('#supplier_box').hide();
         $('#date').val(createTime())
        setInterval(function(){
            $('#date').val(createTime())
        },1000 )
        
    })
    $('#putaway').css({background:'#ccc'})
    $('#putaway').click(function(){
        $('#putaway').css({background:'#ccc'})
        $('#sellGoods').css({background:'#fff'})

        $('.sellGoods').hide();
        $('#supplier_box').show();
    });
    // 设置时间
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
    // 进入页面显示已经上架商品
    $.post(common.baseUrl+"/create",function(result){
        jia(result)
    })
    function jia(result){
        // console.log(result.data)
        result.data.forEach(function(item){

            for(var attr in item){
                var $tr = $(`
                    <tr>
                    <td>${item.goods_order}</td>
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
    // 做商品下架造作
    function delete1(target){
        if(target.id=='delete'){

            var goods_order=$(target).parents('tr').children('td').eq(0).text();
            
            $.post(common.baseUrl+'/delete',{goods_order:goods_order}, function(result){
                if(result.ok===1){
                    $(target).parents('tr').remove();
                }
            });
        }
    }
    //修改上架信息
    // 商品编号不能改
    function revamp(target){
        if(target.id=='revamp'){
            var tdval=$(target).parents('tr').children('td');
            var term=
                {   
                    goods_order:tdval.eq(0).text(),
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
    // 模糊搜索仓库商品数据
 $('#hunt').click(function(){
        $('.putaway_box').show();
        $.post(common.baseUrl+'/hunt',{
            fuzSearch:true,
            info:$('#inputSuccess1').val()
            },function(result){
                // var data = response.data;
                putawayData = result.data;
                putawayShow(result)
        })
    })
    // 根据商品名称或商品分类进行搜索
    $('#affirm').click(function(){
        $('.putaway_box').show();
        var gName={goods_name:$('#goodsName').val()};
        var gClass={goods_classify:$('#goodsClass').val()};
        var obj= $('#goodsName').val()==""? gClass : $('#goodsClass').val()=="" ? gName : Object.assign({}, gClass, gName);
        $.post(common.baseUrl+'/putaway',obj, function(result) {
            putawayData = result.data;
            putawayShow(result);
            console.log()
        });
        
    });
    $('.putaway_box').click(function(e){
        if($(e.target).hasClass('btn btn-success btn-xs ss')){
            putawayData.forEach(function(item){
                delete item._id;
            })
            var length1 = putawayData.length;
            var trs= $('#createTable').find('tr')
            var length2 = trs.length;
            for(var i=1 ; i<length2; i++){
                for(var j = 0; j<length1; j++){
                    var num=$(trs[i]).children().eq(1).children().eq(0).val();
                    
                    if(num == putawayData[j].goods_code){
                        var qty=$(trs[i]).children().eq(4).children().eq(0).val();
                        qty=qty*1+putawayData[j].goods_qty*1
                        $(trs[i]).children().eq(4).children().eq(0).val(qty)
                            putawayData[j].goods_qty=qty;
                            $.post(common.baseUrl+'/revamp',putawayData[j],function(result){

            
                                    
                                
                            })
                            putawayData.splice(j,1);
                            length1--;
                        break;
                    }
                }

            }
            $.post(common.baseUrl+'/putawaySave', {arr:JSON.stringify(putawayData)}, function(res){
                
                res.data=res.ops;
                if(res.result.ok==1){
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
                            <td>${item.goods_order}</td>
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
            }
    }
    /*--------------------------收银管理-------------------------------------*/
    $('.payoffTable').hide();
    var arr = [];
    // 手动或扫码添加商品到待结算表
    $('#huntGoods').click(function(){
      changegoods();
    });
    var gg = document.querySelector('#goodsNum')
    var timeoutID
    gg.oninput=function(){
        clearTimeout(timeoutID)
        timeoutID=setTimeout(function(){
            console.log(66)
            changegoods();
        },500);
        
    }
    function changegoods(){
        console.log(666);
        var obj = {
            goods_code:$('#goodsNum').val()
        }

            var a=true;
            // console.log(arr.length)
            for(var i=0;i<arr.length; i++){

                if(arr[i]==$('#goodsNum').val()){
                    a=false;
                    var js=i;
                    
                    break;
                }
            }
            if(!a){
                var qtyinp= $('#clearlist').find('tr').eq(js+1).find('input').eq(4)
               var qty =qtyinp.val()
               qty++;
               qtyinp.val(qty)
               console.log(qty)
            }else{

                $.post(common.baseUrl+'/sellGoods', obj, function(result) {
                    if(result.status){
                        if(result.data.length>0){
                            arr.push(result.data[0].goods_code);
                            var res=result.data[0];

                                var $tr = $(`
                                    <tr>
                                    <td><input type="text" value="${res.goods_order}"/></td>
                                    <td><input type="text" value="${res.goods_code}"/></td>
                                    <td><input type="text" value="${res.goods_name}"/></td>
                                    <td><input type="text" value="${res.goods_classify}"/></td>
                                    <td><input type="text" value="1" class="qty"/></td>
                                    <td><input type="text" value="${res.sale_price}"/></td>
                                    <td>${createTime()}</td>
                                    </tr>
                                    `)
                                $tr.appendTo($("#clearlist"));
                        }else{
                            alert('没有此商品');
                        }
                    }
                     
                });
            }
            $('#goodsNum').val('')
    }
    // 账单结算
    var closeData = [];
    var total=0;
    $('#clearBtn').click(function(){
        var trs=$('#clearlist').find('tr');
        for(var i=1;i<=arr.length;i++){
            var obj = {
                goods_name:$(trs[i]).children().eq(2).children().eq(0).val(),
                goods_qty:$(trs[i]).children().eq(4).children().eq(0).val(),
                sale_price:$(trs[i]).children().eq(5).children().eq(0).val(),
                time:createTime()
            };
            closeData.push(obj);
            total+=obj.sale_price*obj.goods_qty;
        }
        // window.location.href = '../html/print.html';
        // closeData = JSON.stringify(closeData);
        // // 删除多余的&
        $('.Qrcode').show();
        // console.log(closeData)
        erweima();

    })
    function erweima(){
        console.log(total);
        $('#qrcode').qrcode("http://10.3.131.3/super/libs/html/payment.html?total="+total);
            var ws;
            ws = new WebSocket("ws://10.3.131.3:888");
            ws.onmessage = function(_msg){
                console.log(_msg.data);

                success();
            }   

            ws.onopen = function(){
                console.log(666);
            }   

            $('#payment').click(function(_me){
                ws.send("aaa");
                // ws.close();
            })
            // socket = io("ws://localhost:888");
            // socket.on('ok',function(msg){
            //      success();
            //     console.log(msg)
            // });
    }
    $('.Qrcode').hide();
    
    
     $('.success').hide();
    function success(){
        $('.Qrcode').hide();
        $('.success').show();


    }
    var list ='';
    $('#print').click(function(){
        list = closeData.map(function(item){
            return '商品名称:'+item.goods_name+'\n'+'单品数量:'+item.goods_qty+'\n'+'商品金额:'+item.sale_price+'\n'
        }).join('');
        $.post("http://10.3.131.33:81/print", {text:
        'BTTT 超市收银系统  \n'
        +'*************************************\n'
        +list
        +'总金额：'+total+'\n'
        +'买单时间：'+createTime()+'\n'
        +'*************************************\n'}, function(res){
            console.log(res)
        $('.success').hide();
            

})
    })
})
