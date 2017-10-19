

module.exports = {
	Product:function(app, urlencode, db){


		app.post("/search_ground",urlencode,function(request,response){
			//查询上架
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

      app.post("/insert_product",urlencode,function(request,response){
       		db.select("reserve", {sup_name: request.body.sup_name}, function(result){
                if(result.status){
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

      app.post("/delete_product",urlencode,function(request,response){
        
        db.delete("reserve", request.body, function(result){
            response.send(result);
        })
      });

      app.post("/update_product",urlencode,function(request,response){
          db.update("reserve", [{sup_name:request.body.sup_name},request.body], function(result){
              response.send(result);
          });
      });

      app.post("/search_product",urlencode,function(request,response){
        //判断是否模糊
        if(request.body.blurSearch1){
            db.select("reserve",
                {$or:[{goods_order:{$regex:request.body.info}},
                        {goods_name:{$regex:request.body.info}},
                        {goods_classify:{$regex:request.body.info}},
                        {goods_qty:{$regex:request.body.info}},
                        {sup_name:{$regex:request.body.info}},
                    ]
                },
                function(result){
                response.send(result);
            })
            return false;
        }
        //判断是否精确查找
        else if(request.body.clearSearch1){
          db.select("reserve",
                {$or:[
                      {goods_name:request.body.goods_name},
                      {goods_classify:request.body.goods_classify},
                      {sup_name:request.body.sup_name}
                    ]
                },
                function(result){
                response.send(result);
            })
            return false;
        }
        else{
          db.select("reserve", {}, function(result){
              if(!result.status){
                  response.send(result);
              } else if(result.data.length > 0) {
                  response.send(result);
              } else { 
                  response.send({status: false, message: "错误"});
              }
          });
        }

      });
	}
}