var mongodb = require('mongodb');
var dbServer = new mongodb.Server('10.3.131.22', 27017);
var db = new mongodb.Db('BTTT', dbServer);
// var querystringify= require('querystringify')
module.exports = {
    insert: function(_collection, _data, _callback){
        db.open(function(error, db){
            if(error){
                _callback({status: false, message: error});
            } else {
                db.collection(_collection, function(error, collection){
                    if(error){
                        _callback({status: false, message: error});
                    } else {
                        collection.insert(_data);
                        _callback({status: true,data:_data});
                    }
                    db.close();
                })
            }
        })
    },
    select: function(_collection, _condiction, _callback){
        db.open(function(error, db){
            if(error){
                _callback({status: false, message: error});
            } else {
                db.collection(_collection, function(error, collection){
                    if(error){
                        _callback({status: false, message: error});
                    } else {
                        collection.find(_condiction || {}).toArray(function(error, dataset){
                            db.close();
                            if(error){
                                _callback({status: false, message: error});
                            } else {
                                _callback({status: true, data:dataset});
                            }
                        })
                    }
                })
            }
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
                            if(err){console.log(5)
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
    delete: function(_collection, _condition, _callback){
        db.open(function(error, db){
            if(error){
                _callback({status: false, message: error});
            } else {
                db.collection(_collection, function(error, collection){
                    if(error){
                        _callback({status: false, message: error});
                    } else {
                        collection.remove(_condition,{safe:true},function(error,result){
                            if(error){
                                _callback({status: false, message: error});
                            } else {
                                _callback({status: true, data: result});
                            }
                            db.close();
                      });
                    }
                })
            }
        })
    }
}