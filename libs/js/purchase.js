

jQuery(function($){
	common.navigationBars();
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
        console.log(response);
        if(!response.status){
            alert('请先登录');
            window.location.href= "login.html";
        }else{
        	var username = response.username;
        	$("#currUser").text(username);
        }
    });   

	


        
	$('.content .top li').eq(0).children().css({backgroundColor:'#5cb85c',color:'#fff'});

	$.post(common.baseUrl + "/search_purchase",function(result){
	$("#purchase_box table tbody tr").remove();
		render2(result.data);
	});





	var purchase = document.querySelector('#purchase_box');
	function edit(boxId){
		// 事件委托：把事件绑定给td的父级
		boxId.onclick = function(e){
			e = e || window.event;
			var target = e.target || e.srcElement;

			// 点击td编辑
			if(target.tagName.toLowerCase() === 'td'){

				if(target === target.parentNode.lastElementChild.previousElementSibling
				 || target === target.parentNode.lastElementChild ||
				 target === target.parentNode.firstElementChild ||
				  target === target.parentNode.lastElementChild.previousElementSibling.previousElementSibling){
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

	edit(purchase);

	function createTime(){
        var d = new Date();
        var year = d.getFullYear();
        var mon = d.getMonth() + 1;
        var date = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        return(year + '-' + mon + '-' + date + '-' + hour + ':' + min);
    }




	//点击“增加”按钮，实现添加进货商品
	$("#add_purchase").click(function(){
		$(".add_pur_box").show();
	});
	$(".close").click(function(){
		$(".add_pur_box").hide();
	});



	function render2(data){
		data.forEach(function(item){
			for(var attr in item){
				var $tr = $(`
					<tr>
					<td class="goods_order">${item.goods_order}</td>
					<td class="goods_code">${item.goods_code}</td>
					<td class="goods_name">${item.goods_name}</td>
					<td class="goods_classify">${item.goods_classify}</td>
					<td class="goods_qty">${item.goods_qty}</td>
					<td class="prime_price">${item.prime_price}</td>
					<td class="sale_price">${item.sale_price}</td>
					<td class="supName">${item.sup_name}</td>
					<td class="time">${createTime()}</td>
					<td><button class="btn btn-default btn-xs affirm">修改</button></td>
					<td><button class="btn btn-default btn-xs delete">删除</button></td>
					</tr>
					`)
			}
			$tr.appendTo($("#purchase_box table tbody"));
		})
	}



	$("#sup_name").focus(function(){
		$.post(common.baseUrl + "/search_supplier",function(result){
			//生成ul
			var $ul = $("<ul/>");
			$(result.data).each(function(idx,item){
				var $li = $("<li/>").text(item.sup_name).appendTo($ul);
			});
			$ul.appendTo($(".add_pur_box"));
			$ul.on("click","li",function(){
				$("#sup_name").val($(this).text());
				$ul.hide();
			})
		})
	})
	//添加输入商品的信息
	$("#addToPur").click(function(){
		//点击供货商的框，请求supplier的数据库
		//获取输入框的信息
		var msg = {
			goods_order:$("#goods_order").val(),
			goods_code:$("#goods_code").val(),
			goods_name:$("#goods_name").val(),
			goods_qty:$("#goods_qty").val(),
			goods_classify:$("#goods_classify").val(),
			prime_price:$("#prime_price").val(),
			sale_price:$("#sale_price").val(),
			sup_name:$("#sup_name").val(),
			time:createTime(),
		}
		$.post(common.baseUrl + "/insert_purchase",msg,function(result){
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
		$tr.appendTo($("#purchase_box table tbody"));

		// window.location.reload();
	});

	

	//删除商品
	$("#purchase_box").on("click",".delete",function(){
		//删除当前tr:dom节点+数据库都删除
		var msg = {goods_order:$(this).parents("tr").find(".goods_order").text()}
		$(this).parents("tr").remove();
		$.post(common.baseUrl + "/delete_purchase",msg,function(result){
			// console.log(result);
		})
	});


	//点击“修改”按钮，更改数据
	$("#purchase_box").on("click",".affirm",function(){
		//获取当前行
		var msg = {
			goods_order:$(this).parents("tr").find(".goods_order").text(),
			goods_code:$(this).parents("tr").find(".goods_code").text(),
			goods_name:$(this).parents("tr").find(".goods_name").text(),
			goods_qty:$(this).parents("tr").find(".goods_qty").text(),
			goods_classify:$(this).parents("tr").find(".goods_classify").text(),
			prime_price:$(this).parents("tr").find(".prime_price").text(),
			sale_price:$(this).parents("tr").find(".sale_price").text(),
			sup_name:$(this).parents("tr").find(".supName").text(),
		}

		$.post(common.baseUrl + "/update_purchase",msg,function(result){
			// console.log(result);
		})
	});


	


	//精确查询
	$("#clearSearch2").click(function(){
		var msg = {
			clearSearch2:true,
			prime_priceMin:$("#pur1").val(),
			prime_priceMax:$("#pur2").val(),
			sale_priceMin:$("#sel1").val(),
			sale_priceMax:$("#sel2").val(),
			goods_qtyMin:$("#amo1").val(),
			goods_qtyMax:$("#amo2").val(),
			goods_name:$("#purchase_box #firmSel").val(),
			goods_classify:$("#purchase_box #classSel").val(),
		};
		console.log(msg);
		$.post(common.baseUrl + "/search_purchase",msg,function(result){
			var data = result.data;
			console.log(data);
			$("#purchase_box table tbody tr").remove();
			render2(data);
		})
	});
})