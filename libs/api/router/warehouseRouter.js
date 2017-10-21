var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});
var url = require('url');
var jwt = require('jsonwebtoken');//
module.exports = {
    Warehouse: function(app,urlencode,db){
        app.use(bodyparser.urlencoded({extended: false}));
                //过滤器

        app.post("/reserve", urlencode, function(request, response){
            // console.log(request.body);
            
            // -----判断是否是删除
            if(request.body.delet){
                db.delete("reserve",{goods_order:request.body.goods_order}, function(result){
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
                    // console.log(result);
                    if(!result.status && result.data.length != 0){
                        response.send(result);
                    }else if(result.data.length > 0){
                        // console.log(request.body)
                        // console.log(result);
                        var goods_qty = 0;
                        var obj ={};
                        if(request.body.return){
                            goods_qty = parseInt(result.data[0].goods_qty) - parseInt(request.body.return_qty);
                            if(goods_qty < 0){
                                response.send({message:"库存不足"});
                                return false;
                            }
                            obj = {
                                goods_order:result.data[0].goods_order,
                                goods_code:result.data[0].goods_code,
                                goods_name:result.data[0].goods_name,
                                goods_classify:result.data[0].goods_classify,
                                goods_qty:goods_qty,
                                sup_name:result.data[0].sup_name,
                                prime_price:parseFloat(result.data[0].prime_price),
                                sale_price:parseFloat(result.data[0].sale_price),
                                time:request.body.time
                            }; 
                        }else{
                            goods_qty= parseInt(request.body.goods_qty)+parseInt(result.data[0].goods_qty);

                            obj = {
                                goods_order:request.body.goods_order,
                                goods_code:request.body.goods_code,
                                goods_name:request.body.goods_name,
                                goods_classify:request.body.goods_classify,
                                goods_qty:goods_qty,
                                sup_name:request.body.sup_name,
                                prime_price:parseFloat(request.body.prime_price),
                                sale_price:parseFloat(request.body.sale_price),
                                time:request.body.time
                            }; 
                        }

                        db.update("reserve",[{goods_order:request.body.goods_order},obj],function(result){
                            // console.log(result);
                            response.send(result);
                        });
                    }else if(result.data.length == 0){
                        if(request.body.return){
                            response.send({message:'商品不存在'});
                            return false;
                        }
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
                            // console.log(result)
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

            // // ----判断是否是精确搜索
            // if(request.body.cerSearch){
            //     // db.col.find({likes : {$lt :200, $gt : 100}})
            //     //  大于100小于200
            //     db.select("return",
            //         {
            //             prime_price:{$gte:parseInt(request.body.prime_priceMin) || -1,$lte:parseInt(request.body.prime_priceMax) || 10000},
            //             sale_price:{$gte:parseInt(request.body.sale_priceMin) || -1,$lte:parseInt(request.body.sale_priceMax) || 10000},
            //             goods_qty:{$gte:parseInt(request.body.goods_qtyMin) || -1,$lte:parseInt(request.body.goods_qtyMax) || 10000},
            //             goods_classify:{$regex:request.body.goods_classify || ''},
            //             sup_name:{$regex:request.body.sup_name || ''}
            //         },
            //         function(result){
            //         response.send(result);
            //     })
            //     return false;
            // };

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
                    console.log(result);
                    if(!result.status && result.data.length != 0){
                        response.send(result);
                    }else if(result.data.length > 0){
                        var obj = {
                            goods_order:request.body.goods_order,
                            goods_name:request.body.goods_name,
                            goods_classify:request.body.goods_classify,
                            sup_name:request.body.sup_name,
                            return_qty:parseInt(request.body.return_qty),
                            time:request.body.time
                        };                        
                        db.update("return",[{goods_order:request.body.goods_order},obj],function(result){
                            // console.log(result);
                            response.send(result);
                        });
                    }else if(result.data.length == 0){
                        // console.log(result);
                        var obj = {
                            goods_order:request.body.goods_order,
                            goods_name:request.body.goods_name,
                            goods_classify:request.body.goods_classify,
                            sup_name:request.body.sup_name,
                            return_qty:parseInt(request.body.return_qty),
                            time:request.body.time
                        };
                        db.insert("return", obj, function(result){
                            // console.log(result)
                            response.send(result);
                        });
                        
                    }
                })
            }
        });
       
    }
} 