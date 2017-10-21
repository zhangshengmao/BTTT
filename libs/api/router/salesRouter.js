var fs = require('fs');
var io = require('socket.io')();
module.exports={
    Sales:function(app, urlencode, db){


        // var onlinePersons = {};

        // io.on("connection", function(client){
        //     // console.log(123);
        //     client.on('ServerLogin', function(_person){
        //         var personObj = JSON.parse(_person);
        //         onlinePersons[personObj.id] = personObj;

        //         // io.emit("CreatePersons", JSON.stringify(onlinePersons));
        //         console.log(onlinePersons);
        //     })

        // //     client.on("ServerMove", function(_person){
        // //         var personObj = JSON.parse(_person);
        // //         onlinePersons[personObj.id] = personObj;
        // //         io.emit("ClientMove", JSON.stringify(personObj));
        // //     })
        // })

        // io.listen(887);
        
    },
    Grounding:function(app, urlencode, db){
        app.post('/userControl', urlencode, function(reqeust, response){
            console.log(reqeust.body.username)
            db.select("users", {username: reqeust.body.username}, function(result){
                
                if(!result.status){
                 response.send(result);
                } else if(result.data.length > 0) {

                 response.send({status:false,data:result});

                } else { 
                 db.insert("users", reqeust.body, function(result){
                    console.log(result.data.length)
                    response.send(result);
                 })
                }
            });
        })
        app.post('/grounding', urlencode, function(reqeust, response){
            db.select('grounding', {goods_order:reqeust.body.goods_order}, function(result){
                console.log(reqeust.body)
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
            // console.log(reqeust.body)
            db.update('grounding',arr, function(result){
                console.log(result.status)
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
        app.post('/sellGoods', urlencode, function(reqeust, response){
            console.log(reqeust.body)
            db.select('grounding', reqeust.body, function(result){
                response.send(result)
            });
        })
    }
    
}