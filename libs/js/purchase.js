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
		console.log(result.data.data);
		result.data.data.forEach(function(item){
			for(var attr in item){
				var $tr = $(`
					<tr>
					<td>${item.sup_name}</td>
					<td>${item.sup_address}</td>
					<td>${item.linkman_name}</td>
					<td>${item.linkman_tel}</td>
					<td>${item.linkman_position}</td>
					<td>${item.clerk_name}</td>
					<td>${createTime()}</td>
					<td><button class="btn btn-default btn-xs">确认</button></td>
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
		
	});



/*-----------------------------------------------------------------------*/










/*--------------------------采购进货-------------------------------------*/
	//采购进货
	$("#purchase_box").hide();
	$.post("http://localhost:88/purchase",function(result){
		console.log(result);

	})

/*-----------------------------------------------------------------------*/
})