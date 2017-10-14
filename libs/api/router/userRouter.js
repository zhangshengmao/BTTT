var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});
module.exports = {
    Register: function(app,db){

        app.post("/register", urlencode, function(request, response){
            
            db.select("users", {username: request.body.username}, function(result){
                // console.log(request.query)
                if(!result.status){
                    console.log(result.status)
                    response.send(result);
                } else if(result.data.length > 0) {
                    response.send({status: false, message: "当前用户已存在"});
                } else {console.log(7)
                    db.insert("user", request.body, function(result){
                        response.send(result);
                    })
                }
            })
        })

        app.post("/login", function(request, response){
            //db
            // response.send("aa");
        });
    }
} 