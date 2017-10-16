jQuery(function($){

/*--------------------------供货商管理-------------------------------------*/

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
		date+ week_str[week] + " " + hour + ":" + min + ":" + sec;
		return mydate;
	}

	$.post("http://localhost:88/newSup",function(result){
		result.data.data.forEach(function(item){
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
					<td><button class="btn btn-default btn-xs affirm">确认</button></td>
					<td><button class="btn btn-default btn-xs delete">删除</button></td>
					</tr>
					`)
			}
		$tr.appendTo($("#supplier_box table tbody"));

		})

	});
	//输入供应商的信息
	$("#addToDb").click(function(){

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
		var $yes_del = $(`<td>
			<button class="btn btn-default btn-xs">确认</button></td>
			<td><button class="btn btn-default btn-xs">删除</button></td>`).appendTo($tr);
		$tr.appendTo($("#supplier_box table tbody"));
		$.post("http://localhost:88/insert_supplier",msg,function(result){
			console.log(result);

		});

		window.location.reload();
	});

	//删除供货商
	$("#supplier_box").on("click",".delete",function(){
		//删除当前tr:dom节点+数据库都删除
		var msg = {sup_name:$(this).parents("tr").find(".sup_name").text()}
		$(this).parents("tr").remove();
		$.post("http://localhost:88/delete_supplier",msg,function(result){
			console.log(result);
		})
	});

	var supplier = document.querySelector('#supplier_box')
	// 事件委托：把事件绑定给td的父级
	supplier.onclick = function(e){
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

	//点击“确认”按钮，更改数据
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
		console.log(msg);

		$.post("http://localhost:88/update_supplier",msg,function(result){
			console.log(result);
		})
	})

/*-----------------------------------------------------------------------*/










/*--------------------------采购进货-------------------------------------*/
	//采购进货
	$("#purchase_box").hide();
	$.post("http://localhost:88/purchase",function(result){
		console.log(result);

	})

/*-----------------------------------------------------------------------*/
})