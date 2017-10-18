var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var db;

MongoClient.connect("mongodb:localhost:27017.BTTT",function(err,database){
	if(err) throw err;
	db = database;
});

module.exports = {
	insert:function(_collection,_data,_callback){
		var i = db.collection(_collection,_data).then(function(result){
			_callback(result);
		});
	},
	select:function(_collection,_condition,_callback){
		var i = db.collection(_collection).find(_condition || {}).toArray(function(error,dataset){
			_callback({status:true,data:dataset});
		})
	}
}