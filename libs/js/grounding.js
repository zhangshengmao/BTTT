jQuery(function($){
    // 导航条
    common.navigationBars();
    console.log($('.z_index').text()=='11111');
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
            $('#salesclerk').text(username)
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

        $('.readyList').html('')
        
    });
    $('.sellGoods').hide();
    $('#sellGoods').click(function(){
        $('#sellGoods').css({background:'#ccc'})
        $('#putaway').css({background:'#fff'})
        $('.sellGoods').show();
        $('#supplier_box').hide();
         $('#date').text(common.createTime())
        setInterval(function(){
            $('#date').text(common.createTime())
        },1000 )
        
    })

    $('#putaway').css({background:'#ccc'})
    $('#putaway').click(function(){
        $('#putaway').css({background:'#ccc'})
        $('#sellGoods').css({background:'#fff'})

        $('.sellGoods').hide();
        $('#supplier_box').show();
    });
    // 进入页面显示已经上架商品
    $.post(common.baseUrl+"/create",function(result){
        jia(result)
    })
    function jia(result){
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
                   <td>${common.createTime()}</td>
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
                    alert('删除成功');
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
                    time:common.createTime()
                }
            
            console.log(term)
            $.post(common.baseUrl+'/revamp',term, function(result) {
                alert('修改成功');
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
        var obj={goods_classify:$('#inputSuccess1').val()};
        $.post(common.baseUrl+'/putaway',obj, function(result) {
            putawayData = result.data;
            putawayShow(result);
        });
        
    });
    $('.putaway_box').click(function(e){
        if($(e.target).hasClass('btn btn-success btn-xs ss')){
            putawayData.forEach(function(item){
                delete item._id;
            })
            var qtyj = false;
            var htmlj=false;
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
                                qtyj=true;
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
                    htmlj=true;
                }
            })
            $('.putaway_box').hide();
            alert('新商品上架成功或原商品补给成功');
            var trs=$('.putaway_box tr');
            $('.readyList').html('')
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

                           <td>${common.createTime()}</td>
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
    $('#handMover').click(function(){
      changegoods();
    });
    var gg = document.querySelector('#goodsNum')
    var timeoutID
    // gg.oninput=function(){
    //     clearTimeout(timeoutID)
    //     timeoutID=setTimeout(function(){
    //         console.log(66)
    //         changegoods();
    //     },100);
        
    // }
    $(document).keypress(function(e){
        if(e.keyCode=='13'){
            console.log(e.keyCode)
            $('#goodsNum').focus();
            changegoods();
        }
    })
    function changegoods(){
        console.log(666);
        var obj = {
            goods_code:$('#goodsNum').val()
        }
            var a=true;
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
                                    <td>${common.createTime()}</td>
                                    </tr>
                                    `)
                                $tr.appendTo($("#clearlist"));
                        }else{

                            alert('没有此商品');
                        }
                    }else{
    
                            alert('没有此商品');
                        }
                     
                });
            }
            $('#goodsNum').val('')
    }
    // 账单结算
    var closeData = [];
    var total=0;
    $('#clearBtn').click(function(){
        closeData = [];
        var trs=$('#clearlist').find('tr');
        for(var i=1;i<=arr.length;i++){
            var obj = {
                goods_order:$(trs[i]).children().eq(0).children().eq(0).val(),
                goods_code:$(trs[i]).children().eq(1).children().eq(0).val(),
                goods_name:$(trs[i]).children().eq(2).children().eq(0).val(),
                goods_qty:$(trs[i]).children().eq(4).children().eq(0).val(),
                sale_price:$(trs[i]).children().eq(5).children().eq(0).val(),
                time:common.createTime()
            };
            closeData.push(obj);
            total+=obj.sale_price*obj.goods_qty;
            // obj.total_parice=total;
        }
        dataAccounts(closeData);
        console.log()
        $('.Qrcode').show();
        erweima();

    })
    function erweima(){

        console.log(total);
        $('#qrcode').qrcode("http://10.3.131.3/super/libs/html/payment.html?total="+total);
            var ws;
            ws = new WebSocket("ws:"+common.ip+":888");
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
        $('#qrcode').html('');

    }
    var list ='';
    $('#print').click(function(){
        list = closeData.map(function(item){
            return '商品名称:'+item.goods_name+'\n'+
                    '单品数量:'+item.goods_qty+'\n'+
                    '商品金额:'+item.sale_price+'\n' }).join('');
                     $.post("http://10.3.131.33:81/print", {text:
                    'BTTT 超市收银系统  \n'
                    +'*************************************\n'
                    +list
                    +'总金额：'+total+'\n'
                    +'买单时间：'+common.createTime()+'\n'
                    +'*************************************\n'}, function(res){
                    console.log(res)
                    $('.success').hide();
        })
   })
    $('.closeQrcode').click(function(){
            $('.Qrcode').hide();
            $('#qrcode').html('');
    });
    $('.closesuc').click(function(){
            $('.success').hide();
    });
    function dataAccounts(closeData){
        var obj = {
            orderNumber:Date.now(),
            dataObj:JSON.stringify(closeData)
        }
        console.log(closeData)
       $.post(common.baseUrl+'/dataChange',obj, function(res) {
        console.log(res)
       });
    }
 // console.log()
})
