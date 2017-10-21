// var io = require('socket.io')();
var wss = new socketServer({server: server, port: 888});

wss.on('connection', function (client) {
    client.on('message', function (_message) {
        var _messageObj = '支付成功';
        //status = 1 表示正常聊天
        _messageObj.status = 1;
        // this.message = _messageObj;
        //把客户端的消息广播给所有在线的用户
        wss.broadcast(_messageObj);
        console.log(_message);
        // client.send("");

    });

    // 退出聊天  
    // client.on('close', function() {  
    //     try{
    //         this.message = this.message || {};
    //         // status = 0 表示退出聊天
    //         this.message.status = 0;
    //         //把客户端的消息广播给所有在线的用户
    //         wss.broadcast(this.message);  
    //     }catch(e){  
    //         console.log('刷新页面了');  
    //     }  
    // });  
});

//定义广播方法
wss.broadcast = function broadcast(_messageObj) {  
    wss.clients.forEach(function(client) { 
        client.send(JSON.stringify(_messageObj))
    });  
}; 
// var io = require('socket.io')();
// io.on("connection", function(client){
// 	client.on('pay', function(msg){
// 		io.emit("ok", JSON.stringify(msg));
// 		console.log(666);
// 	})
// })

// io.listen(888);
