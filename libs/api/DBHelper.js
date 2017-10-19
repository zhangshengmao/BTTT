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
            _callback({status:true,data:result});
        });
    },
    select:function(_collection,_condition,_callback){
        db.collection(_collection).find(_condition || {}).toArray(function(error,dataset){
            _callback({status:true,data:dataset});
        })
    },
    update: function(_collection, _condition, _callback){

        db.open(function(error, db){
            if(error){
                _callback({status: false, message: error});
            } else {
                db.collection(_collection, function(error, collection){
                    if(error){
                        _callback({status: false, message: error});
                    } else {
                        // _condition=[{修改的那一条的Id：_id},{修改这条数据的哪一种属性：改成什么,}]
                        collection.update(_condition[0], {$set:_condition[1]}, {safe:true}, function(err, result){

                            if(err){
                                 _callback({status: false, message: error});
                             }else{
                                _callback({status: true, data: result})
                             }
                             db.close();
                        });
                    }
                })
            }
        })

    },
    delete: function(_collection, _data, _callback){
        db.collection(_collection).remove(_data).then(function(result){
            _callback({status:true,data:result});


        })
    }
}