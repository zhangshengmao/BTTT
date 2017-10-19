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
        $.post(common.baseUrl+"/register" , msg, function(res){
             if(res.status){
                console.log(res)
                createElemet(res)
                return false
            }
                alert(res.message);
                
          
        })
    })
    $.post(common.baseUrl+'/lookUp', {}, function(res){
        console.log(res)
        if(res.status){
            jia(res);
        }
    });
    function jia(result){
        result.data.forEach(function(item){

            for(var attr in item){
                var $tr = $(`
                    <tr>
                    <td>${item.username}</td>
                    <td><input type="password" value="${item.password}"/></td>
                    <td><input type="text" value="${item.identity}"/></td>
                    <td><input type="text" value="${item.tel}"/></td>
                    <td><input type="text" value="${item.e_mail}"/></td>
                    <td>${item.createTime}</td>
                   <td>${createTime()}</td>
                    <td><button class="btn btn-default btn-xs revamp" id="revamp">确认</button></td>
                    <td><button class="btn btn-default btn-xs delete" id="delete">删除</button></td>
                    </tr>
                    `)
            }
            $tr.appendTo($("#jion_tbody"));

        })
        

    }
    function createElemet(res){
            var $tr = $(`
            <tr>
            <td><input type="text" value="${res.ops[0].username}"/></td>
            <td><input type="text" value="${res.ops[0].password}"/></td>
            <td><input type="text" value="${res.ops[0].identity}"/></td>
            <td><input type="text" value="${res.ops[0].tel}"/></td>
            <td><input type="text" value="${res.ops[0].e_mail}"/></td>
           <td>${res.ops[0].createTime}</td>
           <td></td>
            <td><button class="btn btn-default btn-xs revamp" id="revamp">确认</button></td>
            <td><button class="btn btn-default btn-xs delete" id="delete">删除</button></td>
            </tr>
            `)
        $tr.appendTo($("#jion_tbody"));
    }
    $('#jion_tbody').click(function(e) {
        delete1(e.target);
        revamp(e.target);
    });
    function delete1(target){
        if(target.id=='delete'){
            console.log(666)
            var createTime =$(target).parents('tr').children('td').eq(5).text();
            console.log(createTime)
            $.post(common.baseUrl+'/delUser',{createTime:createTime}, function(result){
                if(result.ok===1){
                    $(target).parents('tr').remove();
                }
            });
        }
    };
    function revamp(target){
        if(target.id=='revamp'){
            var tdval=$(target).parents('tr').children('td');
            var term=
                {   
                    username:tdval.eq(0).text(),
                    password:tdval.eq(1).children().eq(0).val(),
                    identity:tdval.eq(2).children().eq(0).val(),
                    tel:tdval.eq(3).children().eq(0).val(),
                    e_mail:tdval.eq(4).children().eq(0).val(),
                    createTime:tdval.eq(5).text(),
                    time:createTime()
                }
            
            console.log(term)
            $.post(common.baseUrl+'/revampUser',term, function(result) {
                console.log(result)
            })
        }
    }
    $('#hunt').click(function(){
        console.log(666)
       $.post(common.baseUrl+'/huntUser',{
           fuzSearch:true,
           info:$('#inputSuccess1').val()
           },function(result){
               // var data = response.data;
               putawayData = result.data;
               console.log(result);
               create(result);
       })
    })
    function create(res){
        $('.clearBody').html('');
        res.data.forEach(function(item){
            for(var attr in item){
                var $tr = $(`
                    <tr>
                    <td>${item.username}</td>
                    <td><input type="text" value="${item.password}"/></td>
                    <td><input type="text" value="${item.identity}"/></td>
                    <td><input type="text" value="${item.tel}"/></td>
                    <td><input type="text" value="${item.e_mail}"/></td>
                    <td><input type="text" value="${item.createTime}"/></td>
                   <td>${createTime()}</td>
                    <td><button class="btn btn-default btn-xs revamp" id="revamp">确认</button></td>
                    <td><button class="btn btn-default btn-xs delete" id="delete">删除</button></td>
                    </tr>
                    `)
            }
            $tr.appendTo($("#jion_tbody"));

        })
        $('.tablebox').click(function(e){
            delete1(e.target);
            revamp(e.target);         
        });
    }
    $('#affirm').click(function(){
        var gName={username:$('#username').val()};
        var gClass={identity:$('#identity').val()};
        var obj= $('#username').val()==""? gClass : $('#identity').val()=="" ? gName : Object.assign({}, gClass, gName);
        console.log(obj)
        $.post(common.baseUrl+'/termHunt',obj, function(result) {
            console.log(result);
            create(result);
        });
        
    });
})