	
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
        	console.log(response);
            alert('请先登录');
            window.location.href= "login.html";
        }else{
        	var username = response.username;
        	$("#currUser").text(username);
        }
    });   

    $("#logout").click(function(){
    	$.post('http://localhost:88/login',{token:""},function(response){
	        	console.log(response);
	            // window.location.href= "login.html";
	    });   
    })




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

	function render(data){
		data.forEach(function(item){
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

	//请求库存表reserve:生成表格前面部分
	$.post(common.baseUrl + "/search_product",function(result){

		var obj = [];
		result.data.forEach(function(item){
			obj.push(item);
			//请求上架ground：获取该商品是否上架
			$.post(common.baseUrl + "/search_ground",{goods_order:item["goods_order"]},function(res){
				if(res.status){
					item["putaway"] = "是";
				}else{
					item["putaway"] = "否";
				}
			});

		});

		
		setTimeout(function(){
			render(obj);
		},100)

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



	//删除供货商
	$("#product_box").on("click",".delete",function(){
		//删除当前tr:dom节点+数据库都删除
		var msg = {sup_name:$(this).parents("tr").find(".sup_name").text()}
		$(this).parents("tr").remove();
		$.post(common.baseUrl + "/delete_product",msg,function(result){
			// console.log(result);
		})
	});

	

	//点击“修改”按钮，更改数据
	$("#product_box").on("click",".affirm",function(){
		//获取当前行
		var msg = {
			sup_name:$(this).parents("tr").find(".sup_name").text(),
			sup_address:$(this).parents("tr").find(".sup_address").text(),
			linkman_name:$(this).parents("tr").find(".linkman_name").text(),
			linkman_tel:$(this).parents("tr").find(".linkman_tel").text(),
			linkman_position:$(this).parents("tr").find(".linkman_position").text(),
			clerk_name:$(this).parents("tr").find(".clerk_name").text(),
		}
		$.post(common.baseUrl + "/update_product",msg,function(result){
			// console.log(result);
		})
	});




	//模糊查询
	$("#blurSearch1").click(function(){

		$.post(common.baseUrl + "/search_product",
        {
            blurSearch1:true,
            info:$("#inputSuccess1").val()
        },
        function(result){
            var data = result.data;
            $("#product_box table tbody tr").remove();
			render(data);

        })
	});

	

	$("#clearSearch1").click(function(){
		var msg = {
			clearSearch1:true,
			sup_name:$("#firmSel").val(),
			linkman_name:$(".classSel1").val(),
			clerk_name:$(".classSel2").val()
		};
		$.post(common.baseUrl + "/search_product",msg,function(result){
        	 var data = result.data;
            $("#product_box table tbody tr").remove();
			render(data);
		})
	});




});
