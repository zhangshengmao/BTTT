var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var url = require('url');
var jwt = require('jsonwebtoken');

module.exports = {
    Register: function(app, db){
        // app.use(express.static(path.join(__dirname, '/')));
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
        })
        
        app.post('/login', urlencode, function(request, response){
            //操作数据库
            if(request.body.token){
                var token = request.body.token;
                jwt.verify(token, 'secret', function(error, result){
                    console.log(result);
                     if(error){
                         response.send({status: false, message: error});
                     } else {
                         response.send({status: true,username:result.username});
                     }
                }) 
                return false;                  
            }; 

            db.select('users',request.body, function(result){
                if(!result.status){
                    response.send(result);
                } else {
                    console.log(result);
                    var user = {
                        username:request.body.username,
                        identity:result.data[0].identity

                    };
                    var token = jwt.sign(user, 'secret',{
                        'expiresIn':144000
                    });
                    response.send({
                        state:true,
                        token:token,
                        username:result.data[0].username,
                        identity:result.data[0].identity});
                }
             })
        });
    }
} 