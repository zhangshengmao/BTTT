module.exports = {
    Purchase: function(app, urlencode, db){
      //供货商管理
      app.post("/insert_supplier",urlencode,function(request,response){
       		db.select("supplier", {sup_name: request.body.sup_name}, function(result){
                if(!result.status){
                    response.send(result);
                } else if(result.data.length > 0) {
                    response.send({status: false, message: "当前供货商已存在"});
               
                } else {
                    db.insert("supplier", request.body, function(result){
                        response.send(result);
                    })
                }
          });
      });

      app.post("/delete_supplier",urlencode,function(request,response){
        
        db.delete("supplier", request.body, function(result){
            response.send(result);
        })
      });

      app.post("/update_supplier",urlencode,function(request,response){
          db.update("supplier", [{sup_name:request.body.sup_name},request.body], function(result){
              response.send(result);
          });
      });

      app.post("/search_supplier",urlencode,function(request,response){
        console.log(request.body.info);
        if(request.body.blur1Search){
            db.select("supplier",
                {$or:[{sup_name:{$regex:request.body.info}},
                        {sup_address:{$regex:request.body.info}},
                        {linkman_name:{$regex:request.body.info}},
                        {linkman_tel:{$regex:request.body.info}},
                        {linkman_position:{$regex:request.body.info}},
                        {clerk_name:{$regex:request.body.info}},
                    ]
                },
                function(result){
                response.send(result);
            })
            return false;
        }else{
          db.select("supplier", {}, function(result){
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











      //采购进货
      app.post("/search_purchase",urlencode,function(request,response){
          db.select("goods", {}, function(result){
            if(!result.status){
                response.send(result);
            } else if(result.data.length > 0) {
                response.send(result);
            } else { 
                response.send({status: false, message: "错误"});
            }
          });
      });
      app.post("/insert_purchase",urlencode,function(request,response){
          db.select("goods", {goods_order: request.body.goods_order}, function(result){
                if(!result.status){
                    response.send(result);
                } else if(result.data.length > 0) {
                    response.send({status: false, message: "当前商品已存在"});
               
                } else {
                    db.insert("goods", request.body, function(result){
                        response.send(result);
                    })
                }
          });
      });

      app.post("/delete_purchase",urlencode,function(request,response){
        
        db.delete("goods", request.body, function(result){
            response.send(result);
        })
      });

      app.post("/update_purchase",urlencode,function(request,response){
          db.update("goods", [{goods_order:request.body.goods_order},request.body], function(result){
              response.send(result);
          });
      });

    }
} 
