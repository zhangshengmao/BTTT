module.exports={
    Sales:function(app, urlencode, db, session){
        app.post('/products', function(reqeust, response){
            console.log(reqeust.session.name)
            if(reqeust.session.name){
                console.log(2)
                db.save('..')
                response.send(reqeust.session.identity)
            } else {console.log(1)
                response.send("当用用户没有登陆");
            }
        })
    },
    Grounding:function(app, urlencode, db, session){
        app.post('/grounding', urlencode, function(reqeust, response){
            db.select('grounding', {goods_order:reqeust.body.goods_order}, function(result){
                console.log(reqeust.body)
                if(result.data.length>0){
                    console.log(66)
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
                // console.log(result)
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
                // console.log(result)
                response.send(result);

            });
        })
        app.post('/putawaySave', urlencode, function(reqeust, response){
            var arr=JSON.parse(reqeust.body.arr);
            db.insert('grounding', arr, function(res){
                response.send(res)
            })             
        })

    }
    
}