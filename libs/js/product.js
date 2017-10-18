	
jQuery(function($){

	
	$(".add_pro_box").hide();

	//点击“增加”按钮，实现添加供应商
	$("#add_product").click(function(){
		$(".add_pro_box").show();
	});
	$(".close").click(function(){
		$(".add_pro_box").hide();
	});

	function createTime(){
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var date = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        return(year + '-' + mon + '-' + date + '-' + hour + ':' + min);
    }

	function render(data,bln,num){
		data.forEach(function(item,idx){
			if(bln&&idx+1==num){
				item.putaway = "是";
			}else{
				item.putaway = "否";
			}
			for(var attr in item){
				var $tr = $(`
					<tr>
					<td class="goods_order">${item.goods_order}</td>
					<td class="goods_name">${item.goods_name}</td>
					<td class="goods_classify">${item.goods_classify}</td>
					<td class="goods_qty">${item.goods_qty}</td>
					<td class="supName">${item.sup_name}</td>
					<td class="putaway">${item.putaway}</td>
					<td><button class="btn btn-default btn-xs affirm">修改</button></td>
					<td><button class="btn btn-default btn-xs delete">删除</button></td>
					</tr>
					`)
			}
			$tr.appendTo($("#product_box table tbody"));
		})
	}



	var product = document.querySelector('#product_box');
	function edit(boxId){
		// 事件委托：把事件绑定给td的父级
		boxId.onclick = function(e){
			e = e || window.event;
			var target = e.target || e.srcElement;

			// 点击td编辑
			if(target.tagName.toLowerCase() === 'td'){

				if(target === target.parentNode.lastElementChild.previousElementSibling
				 || target === target.parentNode.lastElementChild ||
				 target === target.parentNode.firstElementChild
				  ){
					return;
				}

				// 生成一个输入框
				var input = document.createElement('input');
				input.type = 'text';
				input.value = target.innerText;

				// 把输入框写入td
				target.innerHTML = '';
				target.appendChild(input);
				input.focus();

				// 失去焦点是保存
				input.onblur = function(){
					target.innerHTML = this.value;
				}
			}
		}
	}

	edit(product);

	//请求库存表:生成表格前面部分
	$.post(common.baseUrl + "/search_product",function(result){

		result.data.forEach(function(item){

			$.post(common.baseUrl + "/search_ground",{goods_order:item["goods_order"]},function(res){
				console.log(res.data);
				if(res.status){
					var num = item["goods_order"]*1;
					console.log(num);
					render(result.data,true,num);
					// render(result.data);
				}else{
					render(result.data);
				}

			});

			// $.post(common.baseUrl + "/search_ground",{goods_order:'0002'},function(res){
			// 	console.log(res.data);
			// 	if(res.status&&res.data[0].goods_order=="0002"){
			// 		var num = (res.data[0].goods_order)*1;
			// 		console.log(num);
			// 		render(result.data,true,num);
			// 		// render(result.data);
			// 	}else{
			// 		render(result.data);
			// 	}

		});

			// $.post(common.baseUrl + "/search_ground",{goods_order:'0001'},function(res){
			// 	console.log(res.data);
			// 	if(res.status&&res.data[0].goods_order=="0001"){
			// 		var num = (res.data[0].goods_order)*1;
			// 		console.log(num);
			// 		render(result.data,true,num);
			// 		// render(result.data);
			// 	}else{
			// 		render(result.data);
			// 	}

			// });

		// })

		// render(result.data);
	

		
	});

	
	//添加
	$("#addToPro").click(function(){

		//获取输入框的信息
		var msg = {
			goods_order:$("#goods_order").val(),
			goods_code:$("#goods_code").val(),
			goods_name:$("#goods_name").val(),
			goods_classify:$("#goods_classify").val(),
			goods_qty:$("#goods_qty").val(),
			sup_name:$("#sup_name").val(),
			prime_price:$("#prime_price").val(),
			sale_price:$("#sale_price").val(),
			putaway:$("#putaway").val(),
			time:createTime()
		}
		$.post(common.baseUrl + "/insert_product",msg,function(result){
			// console.log(result);

		});

		//往表格添加一行
		var $tr = $("<tr/>");
		for(var attr in msg){
			$(`<td></td>`).html(msg[attr]).appendTo($tr);
		}
		var $yes_del = $(`
			<td><button class="btn btn-default btn-xs">修改</button></td>
			<td><button class="btn btn-default btn-xs">删除</button></td>`).appendTo($tr);
		$tr.appendTo($("#product_box table tbody"));

	});


});
