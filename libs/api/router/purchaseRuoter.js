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
        //判断是否模糊
        if(request.body.blurSearch1){
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
        }
        //判断是否精确查找
        else if(request.body.clearSearch1){
          db.select("supplier",
                {$or:[
                      {sup_name:request.body.sup_name},
                      {linkman_name:request.body.linkman_name},
                      {clerk_name:request.body.clerk_name}
                    ]
                },
                function(result){
                response.send(result);
            })
            return false;
        }
        else{
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
         //判断是否模糊
        if(request.body.blurSearch2){
            db.select("goods",
                {$or:[{goods_order:{$regex:request.body.info}},
                            {goods_code:{$regex:request.body.info}},
                            {goods_name:{$regex:request.body.info}},
                            {goods_classify:{$regex:request.body.info}},
                            {goods_qty:parseInt(request.body.info)},
                            {sup_name:{$regex:request.body.info}},
                            {prime_price:parseFloat(request.body.info)},
                            {sale_price:parseFloat(request.body.info)}
                        ]
                    },
                function(result){
                response.send(result);
            })
            return false;
        };
        //判断是否精确查找
         if(request.body.clearSearch2){
              db.select("goods",
                  {
                      prime_price:{$gte:parseInt(request.body.prime_priceMin) || -1,$lte:parseInt(request.body.prime_priceMax) || 10000},
                      sale_price:{$gte:parseInt(request.body.sale_priceMin) || -1,$lte:parseInt(request.body.sale_priceMax) || 10000},
                      goods_qty:{$gte:parseInt(request.body.goods_qtyMin) || -1,$lte:parseInt(request.body.goods_qtyMax) || 10000},
                      goods_classify:{$regex:request.body.goods_classify || ''},
                      goods_name:{$regex:request.body.goods_name || ''}
                  },
                  function(result){
                  response.send(result);
              });
              return false;
          }
        else{
            db.select("goods", {}, function(result){
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
      app.post("/insert_purchase",urlencode,function(request,response){
          db.select("goods", {goods_order: request.body.goods_order}, function(result){
                if(!result.status){
                    response.send(result);
                } else if(result.data.length > 0) {
                    response.send({status: false, message: "当前商品已存在"});
               
                } else {

                    //把写进来的数字改变为数字
                    var obj = {
                        goods_order:request.body.goods_order,
                        goods_code:request.body.goods_code,
                        goods_name:request.body.goods_name,
                        goods_classify:request.body.goods_classify,
                        goods_qty:parseFloat(request.body.goods_qty),
                        sup_name:request.body.sup_name,
                        prime_price:parseFloat(request.body.prime_price),
                        sale_price:parseFloat(request.body.sale_price),
                        time:request.body.time
                    };
                    db.insert("goods", obj, function(result){
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
