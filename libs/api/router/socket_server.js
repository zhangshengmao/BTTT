var io = require('socket.io')();

var onlinePersons = {};

io.on("connection", function(client){
    // console.log(123);
    client.on('pay', function(msg){
        io.emit("ok",msg );
    })

})
io.listen(888)