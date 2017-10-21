var common = common || {};
common.baseUrl = 'http://localhost:88';
common.navigationBars = function(){
    $('#bigul').click(function(e){
        if($(e.target).hasClass('anim')){
            console.log($(e.target).next().children().length);
            $('.smallul').animate({height:0},100);
            if($(e.target).next().height() === 0){

                $(e.target).next().animate({height:60*$(e.target).next().children().length},50);
            }else{
                $(e.target).next().animate({height:0*$(e.target).next().children().length},50);
            }
        }
    })
}
common.identity = function(){
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
        // console.log(response);
        if(!response.status){
            alert('请先登录');
            window.location.href= "login.html";
        }else{
            $.post("http://localhost:88/identity",{
                username:response.username,
            },function(response){
                console.log(response);

                
                if(response.identity == '售货员'){
                    $('#main .nav').children().css({display:'none'});
                    $('#main .nav .navsell').css({display:'block'})
                }else if(response.identity == '超市经理'){
                    
                }else if(response.identity == '仓库管理员'){
                    $('#main .nav').children().css({display:'none'});
                    $('#main .nav .navwarehouse').css({display:'block'})
                }

                
            })           
            var username = response.username;
            $("#currUser").text(username);
        }
    });  
}