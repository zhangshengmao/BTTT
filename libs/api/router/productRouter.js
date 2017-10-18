

module.exports = {
	Product:function(app, urlencode, db){
		app.post("/search_product",urlencode,function(request,response){
			//查询库存表
	        db.select("reserve", {}, function(result){
	            if(!result.status){
	                response.send(result);
	            } else if(result.data.length > 0) {
	                response.send(result);
	            } else { 
	                response.send({status: false, message: "错误"});
	            }
	        });
		});

		app.post("/insert_product",urlencode,function(request,response){
			db.select("reserve", {goods_order: request.body.goods_order}, function(result){
                if(!result.status){
                    response.send(result);
                } else if(result.data.length > 0) {
                    response.send({status: false, message: "当前商品已存在"});
               
                } else {
                    db.insert("reserve", request.body, function(result){
                        response.send(result);
                    })
                }
          });
		});

		app.post("/search_ground",urlencode,function(request,response){console.log(request.body)
			//查询库存表
	        db.select("grounding", {goods_order:request.body.goods_order}, function(result){
	            if(!result.status){
	                response.send(result);
	            } else if(result.data.length > 0) {
	                response.send(result);
	            } else { 
	                response.send({status: false, message: "错误"});
	            }
	        });
		});
	}
}