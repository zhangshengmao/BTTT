var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});
module.exports = {
    Warehouse: function(app,urlencode,db){

        app.post("/reserve", urlencode, function(request, response){
            // console.log(request.body);
            
            // -----判断是否是删除
            if(request.body.delet){
                db.delete("reserve",{goods_order:request.body.goods_order}, function(result){
                    response.send(result);
                })
                return false;
            };

            // ----判断是否是精确搜索
            if(request.body.cerSearch){
                // db.col.find({likes : {$lt :200, $gt : 100}})
                //  大于100小于200
                db.select("reserve",
                    {
                        prime_price:{$gte:parseInt(request.body.prime_priceMin) || -1,$lte:parseInt(request.body.prime_priceMax) || 10000},
                        sale_price:{$gte:parseInt(request.body.sale_priceMin) || -1,$lte:parseInt(request.body.sale_priceMax) || 10000},
                        goods_qty:{$gte:parseInt(request.body.goods_qtyMin) || -1,$lte:parseInt(request.body.goods_qtyMax) || 10000},
                        goods_classify:{$regex:request.body.goods_classify || ''},
                        sup_name:{$regex:request.body.sup_name || ''}
                    },
                    function(result){
                    response.send(result);
                })
                return false;
            };

            // ----判断模糊搜索
            if(request.body.fuzSearch){
                db.select("reserve",
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
                

            // 若request.body.goods_order==''，则为申请集合中所有数据
            if(request.body.goods_order==''){
                 db.select("reserve", {}, function(result){
                    response.send(result);
                });
            }else{
                db.select("reserve", {goods_order:request.body.goods_order}, function(result){
                    if(!result.status){
                        response.send(result);
                    }else if(result.data.length > 0){
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
                        db.update("reserve",[{goods_order:request.body.goods_order},obj],function(result){
                            // console.log(result);
                            response.send(result);
                        });
                    }else if(result.data.length <= 0){
                        // console.log(request.body);
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
                        db.insert("reserve", obj, function(result){
                            response.send(result);
                        });
                        
                    }
                })
            }
        });

        app.post("/receive", urlencode, function(request, response){
            // console.log(request.body);
            
            // -----判断是否是删除
            if(request.body.delet){
                db.delete("receive",{goods_order:request.body.goods_order}, function(result){
                    response.send(result);
                })
                return false;
            };

            // ----判断是否是精确搜索
            if(request.body.cerSearch){
                // db.col.find({likes : {$lt :200, $gt : 100}})
                //  大于100小于200
                db.select("receive",
                    {
                        prime_price:{$gte:parseInt(request.body.prime_priceMin) || -1,$lte:parseInt(request.body.prime_priceMax) || 10000},
                        sale_price:{$gte:parseInt(request.body.sale_priceMin) || -1,$lte:parseInt(request.body.sale_priceMax) || 10000},
                        goods_qty:{$gte:parseInt(request.body.goods_qtyMin) || -1,$lte:parseInt(request.body.goods_qtyMax) || 10000},
                        goods_classify:{$regex:request.body.goods_classify || ''},
                        sup_name:{$regex:request.body.sup_name || ''}
                    },
                    function(result){
                    response.send(result);
                })
                return false;
            };

            // ----判断模糊搜索
            if(request.body.fuzSearch){
                db.select("receive",
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
                

            // 若request.body.goods_order==''，则为申请集合中所有数据
            if(request.body.goods_order==''){
                 db.select("receive", {}, function(result){
                    response.send(result);
                });
            }else{
                db.select("receive", {goods_order:request.body.goods_order}, function(result){
                    if(!result.status){
                        response.send(result);
                    }else if(result.data.length > 0){
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
                        db.update("receive",[{goods_order:request.body.goods_order},obj],function(result){
                            // console.log(result);
                            response.send(result);
                        });
                    }else if(result.data.length <= 0){
                        // console.log(request.body);
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
                        db.insert("receive", obj, function(result){
                            response.send(result);
                        });
                        
                    }
                })
            }            
        });

        app.post("/return", urlencode, function(request, response){
            // console.log(request.body);
            
            // -----判断是否是删除
            if(request.body.delet){
                db.delete("return",{goods_order:request.body.goods_order}, function(result){
                    response.send(result);
                })
                return false;
            };

            // ----判断是否是精确搜索
            if(request.body.cerSearch){
                // db.col.find({likes : {$lt :200, $gt : 100}})
                //  大于100小于200
                db.select("return",
                    {
                        prime_price:{$gte:parseInt(request.body.prime_priceMin) || -1,$lte:parseInt(request.body.prime_priceMax) || 10000},
                        sale_price:{$gte:parseInt(request.body.sale_priceMin) || -1,$lte:parseInt(request.body.sale_priceMax) || 10000},
                        goods_qty:{$gte:parseInt(request.body.goods_qtyMin) || -1,$lte:parseInt(request.body.goods_qtyMax) || 10000},
                        goods_classify:{$regex:request.body.goods_classify || ''},
                        sup_name:{$regex:request.body.sup_name || ''}
                    },
                    function(result){
                    response.send(result);
                })
                return false;
            };

            // ----判断模糊搜索
            if(request.body.fuzSearch){
                db.select("return",
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
                

            // 若request.body.goods_order==''，则为申请集合中所有数据
            if(request.body.goods_order==''){
                 db.select("return", {}, function(result){
                    response.send(result);
                });
            }else{
                db.select("return", {goods_order:request.body.goods_order}, function(result){
                    if(!result.status){
                        response.send(result);
                    }else if(result.data.length > 0){
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
                        db.update("return",[{goods_order:request.body.goods_order},obj],function(result){
                            // console.log(result);
                            response.send(result);
                        });
                    }else if(result.data.length <= 0){
                        // console.log(request.body);
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
                        db.insert("return", obj, function(result){
                            response.send(result);
                        });
                        
                    }
                })
            }
        });
    }
} 