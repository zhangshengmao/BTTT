var userRouter = require('./userRouter');
var db = require('../DBHelper.js');
var warehouseRouter = require('./warehouseRouter.js');
var salesRouter = require('./salesRouter')
var purchaseRouter=require('./purchaseRuoter.js')
var bodyparser = require('body-parser');
var urlencode = bodyparser.urlencoded({extended: false});
var PrimaryRuter = Object.assign({}, userRouter, purchaseRouter,salesRouter,warehouseRouter);

module.exports = {
    Register: function(express){
        var app = express();
        app.all('*', function(req, res, next) {
            // res.writeHead(200, {"Content-Type"})
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
            res.header("X-Powered-By",' 3.2.1')
            if(req.method=="OPTIONS") {
              res.send(200);/*让options请求快速返回*/
            } else{
              next();
            }
        });
        app.use(express.static(__dirname + '/'));
        PrimaryRuter.Register(app, db);
        PrimaryRuter.Purchase(app, urlencode, db);
        PrimaryRuter.Warehouse(app, urlencode, db);    
        PrimaryRuter.Sales(app, urlencode, db);    
        app.listen(88);
        

    }
}