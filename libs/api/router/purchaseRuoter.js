module.exports = {
    Purchase: function(app, urlencode, db){
       //供货商管理
       //添加数据
       app.post("/insert_supplier",urlencode,function(request,response){
       		// console.log(request.body);
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

       //请求并获取所有的数据
       app.post("/newSup",urlencode,function(request,response){
       		db.select("supplier",{}, function(result){
                if(!result.status){
                    response.send(result);
                } else if(result.data.length > 0) {
                    response.send({status:true,data:result});
                } else {
                    response.send({status: false, message:"请求错误"});
                }
            })
       });


       //采购进货
       app.post("/purchase",urlencode,function(request,response){
       		response.send("bbb");
       })
    }
} 
