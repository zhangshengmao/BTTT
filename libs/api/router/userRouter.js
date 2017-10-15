var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});
module.exports = {
    Register: function(app,db){

        app.post("/register", urlencode, function(request, response){
            
            db.select("users", {username: request.body.username}, function(result){
                if(!result.status){
                    response.send(result);
                } else if(result.data.length > 0) {
                    response.send({status: false, message: "当前用户已存在"});
               
                } else { 
                    db.insert("users", request.body, function(result){
                        response.send(result);
                    })
                }
            });
        });

        app.post("/login", urlencode, function(request, response){
            db.select("users", {username: request.body.username}, function(result){
                console.log(result);
                var pwd;
                result.data.forEach(function(item){
                    pwd = item.password;
               

                    if(!result.status){
                        response.send(result);

                    } else if(result.data.length > 0 && request.body.password===pwd) {
                        response.send({status:true,data:result});
                    } else {
                        response.send({status: false, message: "当前用户还未注册/密码错误"});
                    }

                    
                 });
            })
        });
    }
} 