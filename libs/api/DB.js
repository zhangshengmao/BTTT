var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var db;

MongoClient.connect("mongodb://localhost:27017/BTTT",function(err,database){
	if(err) throw err;
	db = database;
});

module.exports = {
	insert:function(_collection,_data,_callback){
		db.collection(_collection).insert(_data).then(function(result){
			_callback(result);
		});
	},
	select:function(_collection,_condition,_callback){
		db.collection(_collection).find(_condition || {}).toArray(function(error,dataset){
			if(dataset.length == 0){
				_callback({status:false,data:dataset});
				return false;
			}
			_callback({status:true,data:dataset});
		})
	},
	update: function(_collection, _condition, _callback){
		db.collection(_collection).update(_condition[0], {$set:_condition[1]}, {safe:true}).then(function(result){
			_callback(result);

		});
	},
	delete: function(_collection, _data, _callback){
		db.collection(_collection).remove(_data).then(function(result){
			_callback(result);


		})
	}
}
