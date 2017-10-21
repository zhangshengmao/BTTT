

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
					<td class="sup_address">${item.sup_address}</td>
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
		$.post(common.baseUrl + "/insert_supplier",msg,function(result){
			console.log(result);

		});

		//往表格添加一行s
		var $tr = $("<tr/>");
		for(var attr in msg){
			$(`<td></td>`).html(msg[attr]).appendTo($tr);
		}
		var $yes_del = $(`
			<td><button class="btn btn-default btn-xs">修改</button></td>
			<td><button class="btn btn-default btn-xs">删除</button></td>`).appendTo($tr);
		$tr.appendTo($("#supplier_box table tbody"));

	});

	//删除供货商
	$("#supplier_box").on("click",".delete",function(){
		//删除当前tr:dom节点+数据库都删除
		var msg = {sup_name:$(this).parents("tr").find(".sup_name").text()}
		$(this).parents("tr").remove();
		$.post(common.baseUrl + "/delete_supplier",msg,function(result){
			// console.log(result);
			if(result.ok==1){
				alert('删除成功');
			}else if(result.status){
				alert("删除失败");
			}
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
			if(result.ok==1){
				alert('修改成功');
			}else if(result.status){
				alert("修改失败");
			}
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
})