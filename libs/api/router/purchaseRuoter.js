module.exports = {
    Purchase: function(app, urlencode, db){
       //供货商管理
       app.post("/supplier",urlencode,function(request,response){
       		response.send("aaa");
       });

       //采购进货
       app.post("/purchase",urlencode,function(request,response){
       		response.send("bbb");
       })
    }
} 
