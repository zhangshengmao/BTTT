

jQuery(function($){

/*--------------------------供货商管理-------------------------------------*/
	


        
	$('.content .top li').eq(0).children().css({backgroundColor:'#5cb85c',color:'#fff'});
    $('.content .top a').click(function(){

        var idx = $(this).parent().index();
        // if(idx == 0){
        //     postUrl = "http://localhost:88/reserve"; 
        //     initTable();
        // }else if(idx == 1){
        //     postUrl = "http://localhost:88/receive";
        //     initTable();
        // }else if(idx == 2){
        //     postUrl = "http://localhost:88/return";
        //     initTable();
        // };
        if(idx==1){
        	$.post(common.baseUrl + "/search_purchase",function(result){
			$("#purchase_box table tbody tr").remove();
				render2(result.data);
			});
        }


        $('.content .top li').children().css({backgroundColor:'#fff',color:'#000'});
        $('.content .top li').eq(idx).children().css({backgroundColor:'#5cb85c',color:'#fff'});
        $('.content .box').children().css({display:'none'}).eq(idx).css({display:'block'});
    });



	$("#supplier_box").hide();

	$("#supplier").click(function(){
		$("#supplier_box").show();
		$("#purchase_box").hide();

	});
	$("#purchase").click(function(){
		$("#supplier_box").hide();
		$("#purchase_box").show();
	});

	$(".add_sup_box").hide();


	//点击“增加”按钮，实现添加供应商
	$("#add_supplier").click(function(){
		$(".add_sup_box").show();
	});
	$(".close").click(function(){
		$(".add_sup_box").hide();
	});


	
	
	function render1(data){
		data.forEach(function(item){
			for(var attr in item){
				var $tr = $(`
					<tr>
					<td class="sup_name">${item.sup_name}</td>
					<td class="sup_adress">${item.sup_address}</td>
					<td class="linkman_name">${item.linkman_name}</td>
					<td class="linkman_tel">${item.linkman_tel}</td>
					<td class="linkman_position">${item.linkman_position}</td>
					<td class="clerk_name">${item.clerk_name}</td>
					<td>${createTime()}</td>
					<td><button class="btn btn-default btn-xs affirm">修改</button></td>
					<td><button class="btn btn-default btn-xs delete">删除</button></td>
					</tr>
					`)
			}
			$tr.appendTo($("#supplier_box table tbody"));
		})
	}


	var supplier = document.querySelector('#supplier_box');
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

	edit(supplier);
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



	$.post(common.baseUrl + "/search_supplier",function(result){
		render1(result.data);
	});

	//添加输入供应商的信息
	$("#addToSup").click(function(){

		//获取输入框的信息
		var msg = {
			sup_name:$("#sup_name").val(),
			sup_address:$("#sup_address").val(),
			linkman_name:$("#linkman_name").val(),
			linkman_tel:$("#linkman_tel").val(),
			linkman_position:$("#linkman_position").val(),
			clerk_name:$("#clerk_name").val(),
			time:createTime(),
		}

		//往表格添加一行
		var $tr = $("<tr/>");
		for(var attr in msg){
			$(`<td></td>`).html(msg[attr]).appendTo($tr);
		}
		var $yes_del = $(`
			<td><button class="btn btn-default btn-xs">确认</button></td>
			<td><button class="btn btn-default btn-xs">删除</button></td>`).appendTo($tr);
		$tr.appendTo($("#supplier_box table tbody"));
		$.post(common.baseUrl + "/insert_supplier",msg,function(result){
			console.log(result);

		});

		window.location.reload();
	});

	//删除供货商
	$("#supplier_box").on("click",".delete",function(){
		//删除当前tr:dom节点+数据库都删除
		var msg = {sup_name:$(this).parents("tr").find(".sup_name").text()}
		$(this).parents("tr").remove();
		$.post(common.baseUrl + "/delete_supplier",msg,function(result){
			console.log(result);
		})
	});

	

	//点击“修改”按钮，更改数据
	$("#supplier_box").on("click",".affirm",function(){
		//获取当前行
		var msg = {
			sup_name:$(this).parents("tr").find(".sup_name").text(),
			sup_address:$(this).parents("tr").find(".sup_address").text(),
			linkman_name:$(this).parents("tr").find(".linkman_name").text(),
			linkman_tel:$(this).parents("tr").find(".linkman_tel").text(),
			linkman_position:$(this).parents("tr").find(".linkman_position").text(),
			clerk_name:$(this).parents("tr").find(".clerk_name").text(),
		}
		$.post(common.baseUrl + "/update_supplier",msg,function(result){
			// console.log(result);
		})
	});




	//模糊查询
	$("#blurSearch1").click(function(){

		$.post(common.baseUrl + "/search_supplier",
        {
            blurSearch1:true,
            info:$("#inputSuccess1").val()
        },
        function(result){
            var data = result.data;
            $("#supplier_box table tbody tr").remove();
			render1(data);

        })
	});

	

	$("#clearSearch1").click(function(){
		var msg = {
			clearSearch1:true,
			sup_name:$("#firmSel").val(),
			linkman_name:$(".classSel1").val(),
			clerk_name:$(".classSel2").val()
		};
		$.post(common.baseUrl + "/search_supplier",msg,function(result){
        	 var data = result.data;
        	 console.log(data);
            $("#supplier_box table tbody tr").remove();
			render1(data);
		})
	});



/*-----------------------------------------------------------------------*/










/*--------------------------采购进货-------------------------------------*/

	// $("#purchase_box").hide();
	$(".add_pur_box").hide();


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
					<td class="supName">${item.supName}</td>
					<td class="time">${createTime()}</td>
					<td><button class="btn btn-default btn-xs affirm">修改</button></td>
					<td><button class="btn btn-default btn-xs delete">删除</button></td>
					</tr>
					`)
			}
			$tr.appendTo($("#purchase_box table tbody"));
		})
	}




	// $("#purchase").click(function(){
	// 	$.post(common.baseUrl + "/search_purchase",function(result){
	// 		$("#purchase_box table tbody tr").remove();
	// 		render2(result.data);
	// 	});

	// });


	//添加输入商品的信息
	$("#addToPur").click(function(){

		//获取输入框的信息
		var msg = {
			goods_order:$("#goods_order").val(),
			goods_code:$("#goods_code").val(),
			goods_name:$("#goods_name").val(),
			goods_qty:$("#goods_qty").val(),
			goods_classify:$("#goods_classify").val(),
			prime_price:$("#prime_price").val(),
			sale_price:$("#sale_price").val(),
			supName:$("#supName").val(),
			time:createTime(),
		}
		console.log(msg);
		//往表格添加一行
		var $tr = $("<tr/>");
		for(var attr in msg){
			$(`<td></td>`).html(msg[attr]).appendTo($tr);
		}
		var $yes_del = $(`
			<td><button class="btn btn-default btn-xs">修改</button></td>
			<td><button class="btn btn-default btn-xs">删除</button></td>`).appendTo($tr);
		$tr.appendTo($("#purchase_box table tbody"));
		$.post(common.baseUrl + "/insert_purchase",msg,function(result){
			console.log(result);

		});

		// window.location.reload();
	});

	

	//删除商品
	$("#purchase_box").on("click",".delete",function(){
		//删除当前tr:dom节点+数据库都删除
		var msg = {goods_order:$(this).parents("tr").find(".goods_order").text()}
		$(this).parents("tr").remove();
		$.post(common.baseUrl + "/delete_purchase",msg,function(result){
			console.log(result);
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
			supName:$(this).parents("tr").find(".supName").text(),
		}

		$.post(common.baseUrl + "/update_purchase",msg,function(result){
			console.log(result);
		})
	});


	//模糊查询
	$("#blurSearch2").click(function(){
		var msg = {
					blurSearch2:true,
					info:$(".inputSuccess2").val()
				};
		$.post(common.baseUrl + "/search_purchase",msg,function(result){
			var data = result.data;
			console.log(data);
			$("#purchase_box table tbody tr").remove();
			render2(data);

		})
	});



	//精确查询
	// $("#clearSearch2").click(function(){
	// 	var msg = {
	// 		pur1:$("#pur1").val(),
	// 		pur2:$("#pur2").val(),
	// 		sel1:$("#sel1").val(),
	// 		sel2:$("#sel2").val(),
	// 		amo1:$("#amo1").val(),
	// 		amo2:$("#amo2").val(),
	// 		goods_name:$("#purchase_box #firmSel").val(),
	// 		goods_classify:$("#purchase_box #classSel").val(),
	// 	};
	// 	// console.log(msg);
	// 	$.post(common.baseUrl + "/search_purchase",msg,function(result){
 //        	var goodsName = new RegExp(msg.goods_name);
 //        	var goodsClassify = new RegExp(msg.goods_classify);
	// 		var data = [];
	// 		result.data.forEach(function(item){
	// 			for(var attr in item){
	// 				if(goodsName.test(item["goods_name"])&&goodsClassify.test(item["goods_classify"])
	// 					){
	// 					data.push(item);
	// 					break;
	// 				}
	// 			}
	// 		});
	// 		console.log(data);
	// 		$("#purchase_box table tbody tr").remove();
	// 		render2(data);
	// 	})
	// });


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
/*-----------------------------------------------------------------------*/
})