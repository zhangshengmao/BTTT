var common = common || {};
common.baseUrl = 'http://localhost:88';



common.navigationBars = function(){
    $('#bigul').click(function(e){
        if($(e.target).hasClass('anim')){
            console.log($(e.target).next().children().length);
            $('.smallul').animate({height:0},100);
            $(e.target).next().animate({height:60*$(e.target).next().children().length},50);
        }
    })
}