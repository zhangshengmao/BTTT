var fs = require('fs');
var io = require('socket.io')();
module.exports={
    Sales:function(app, urlencode, db){  
    },
    Grounding:function(app, urlencode, db){
        app.post('/userControl', urlencode, function(reqeust, response){
            db.select("users", {username: reqeust.body.username}, function(result){
                
                if(!result.status){
                 response.send(result);
                } else if(result.data.length > 0) {

                 response.send({status:false,data:result});

                } else { 
                 db.insert("users", reqeust.body, function(result){
                    response.send(result);
                 })
                }
            });
        })
        app.post('/grounding', urlencode, function(reqeust, response){
            db.select('grounding', {goods_order:reqeust.body.goods_order}, function(result){
               
                if(result.data.length>0){
                    response.send({status:false});
                }else{
                    db.insert('grounding', reqeust.body, function(result){
                        response.send(result);
                    })
                }
            })
            
        })
        app.post('/create', urlencode, function(reqeust, response){
            db.select('grounding', {}, function(result){
                response.send(result);
            })       
        })
        app.post('/delete', urlencode, function(reqeust, response){
            db.delete('grounding',reqeust.body, function(result){
                response.send(result)
            })
        });
        app.post('/revamp', urlencode, function(reqeust, response){
            var arr=[{goods_order:reqeust.body.goods_order},
                    reqeust.body
            ]
            db.update('grounding',arr, function(result){
               
                response.send(result)
            })
        })
        app.post('/hunt', urlencode, function(request, response){
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
        })
        app.post('/putaway', urlencode, function(reqeust, response){
            db.select('reserve', reqeust.body, function(result){
               
                response.send(result);

            });
        })
        app.post('/putawaySave', urlencode, function(reqeust, response){
            var arr=JSON.parse(reqeust.body.arr);
            db.insert('grounding', arr, function(res){
                response.send(res)
            })             
        })
        app.post('/sellGoods', urlencode, function(reqeust, response){
         
            db.select('grounding', reqeust.body, function(result){
                response.send(result)
            });
        })
        app.post('/dataChange', urlencode, function(reqeust, response){
            var data = JSON.parse(reqeust.body.dataObj);
                var js=-1;
                callback();
                function callback(){
                    js++;
                    if(js==data.length){
                        response.send({status:true})
                        db.insert('orderHistory', reqeust.body, function(res){
                            response.send(res)
                        })
                        return;

                    }
                    
                    var arr={goods_order:data[js].goods_order}
                    db.select('grounding',arr, function(res){
                       
                       if(res.status){
                            res.data[0].goods_qty=res.data[0].goods_qty-data[js].goods_qty;
                            var dataarr=[arr, res.data[0]];
                            db.update('grounding',dataarr, function(result){
                                    callback(); 
                            })
                       }
                    })
                }
        })
    }
    
}