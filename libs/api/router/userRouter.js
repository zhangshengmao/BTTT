var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});
var express = require('express');
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
        
        app.post('/login', urlencode, function(reqeust, response){
            //操作数据库
            
               
            db.select('users',reqeust.body, function(result){
                if(!result.status){
                    response.send(result);

                } else {
                    var path = require('path');
                    var cookieParser = require('cookie-parser');
                    var session = require('express-session');
                    app.use(cookieParser());
                    app.use(session({
                        secret: '12345',
                        name: 'testapp',
                        cookie: {maxAge: 80000 },
                        resave: false,
                        saveUninitialized: true,    
                    }))
                    app.use(express.static(path.join(__dirname, '/')));
                    
                    //操作数据库
                    console.log(reqeust.body);
                    
                    var username = reqeust.body.username;
                    var password = reqeust.body.password;
                    // reqeust.session.name = username;
                    response.send(result); 
                }
             });
        })
    }
} 