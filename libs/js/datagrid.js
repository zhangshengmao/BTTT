$.fn.datagrid = function(opts){
	var _defalt = {
		url: '',
		cols: null,
		method: 'get',
		edit: false,
		delete: false,
		info:{}
	}

	var options = $.extend(_defalt, opts);

	var $container = $(this);

	var init = function(){
		var $table = $('<table class="table table-bordered table-hover"></table>').click(function(event){
			events(event);
		});
		var $thead = $('<thead></thead>');
		var $tbody = $('<tbody></tbody>');
		$.get('../dictionary/commonDic.txt', function(dic){
			var dicObj = JSON.parse(dic);
	
			$.post(options.url,options.info, function(response){
				// console.log(response);
				if(response.status && response.data[0]){
					var cols = options.cols ? options.cols.split(',') : options.cols;

					//生成 thead
					var $tr = $('<tr></tr>');
					for(var key in response.data[0]){
						if(!cols || (cols && cols.indexOf(key) > -1)){
							$("<th></th>").text(dicObj["cn"][key] || key).appendTo($tr);
						}
					}
					$('<th></th>').html('<button class="btn btn-success btn-xs addtr" flag="addtr">增加</button>').appendTo($tr);
					$('<th></th>').html('').appendTo($tr);		
					$tr.appendTo($thead);
					$thead.appendTo($table);

					//生成 tbody
					for(var i = 0; i < response.data.length; i++){
						$tr = $('<tr></tr>');
						for(var key in response.data[i]){
							if(!cols || (cols && cols.indexOf(key) > -1)){
								$td = $('<td></td>')
								$('<input type="text" />').val(response.data[i][key]).appendTo($td);
								$td.appendTo($tr);
							}
						}
						if(options.edit){
							$('<td><button class="btn btn-default btn-xs addTo" flag="addTo">确认</button></td>').appendTo($tr);
						}
						if(options.delete){
							$('<td><button class="btn btn-default btn-xs delet" flag="delet">删除</button></td>').appendTo($tr);
						}					
						$tr.appendTo($tbody);
					}
					// var $caption = $('<caption>库存管理表</caption>');
					// $caption.appendTo($table);
					$tbody.appendTo($table);

					$table.appendTo($container);
				}
			})
		})
	}

	init();

    function Time(){
    var d = new Date();
    var year = d.getFullYear();
    var mon = d.getMonth() + 1;
    var date = d.getDate();
    var hour = d.getHours();
    var min = d.getMinutes();
    return(year + '-' + mon + '-' + date + '-' + hour + ':' + min);
	}

	// ------添加和修改信息
	var events = function(event){
		var currObj = $(event.target);
		if(currObj.is('button') && currObj.attr('flag') == 'delet'){

	        var tr = currObj.parent().parent();
	        $.post(options.url, 
	            {goods_order:$(tr).children().eq(0).children().val(),delet:true},
	            function(response){
	            	console.log(response)
	            if(response.ok == 1){
	                $(tr).remove();  
	            }
	        });			
		}else if(currObj.is('button') && currObj.attr('flag') == 'addTo'){
	        var tr = currObj.parent().parent();
	       	$.post(options.url, 
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
	            // var data = response.data;
	            // console.log(data);
	        });  			
		}else if(currObj.is('button') && currObj.attr('flag') == 'addtr'){
		    $('.tableBox').on('click','.addtr',function(){
		        $('.add_info').css({display:'block'}); 
		    });
		}
	}
}