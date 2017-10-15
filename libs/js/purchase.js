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

	//点击“增加”按钮，实现添加供应商
	$("#add_supplier").click(function(){

	});


	$.post("http://localhost:88/supplier",function(result){
		console.log(result);

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