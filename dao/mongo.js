function getCollection(callback) {
	require('mongodb').MongoClient.connect('mongodb://localhost/incloudb', function(err, db) {//'mongodb'+require('../config/dburl')
		if(err)throw err
		else callback(db)
	})
}
exports.find=function(collection,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		console.log('=================')
		console.log(data)
		collection.find(data).toArray(function(err, docs) {
			db.close()
			next(err,docs)
		})
	})
}
exports.findOne=function(collection,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		collection.findOne(data,function(err, docs) {
			db.close()
			next(err,docs)
		})
	})
}
exports.update=function(collection,where,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		collection.update(where,data,function(err, docs) {//{$set:data}
			db.close()
			next(err,docs)
		})
	})
}
exports.upsert=function(collection,where,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		collection.update(where,data,true,function(err, docs) {//{$push:push}
			db.close()
			next(err,docs)
		})
	})
}
exports.insert=function(collection,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		collection.insert(data,function(err, docs) {
			db.close()
			next(err,docs)
		})
	})
}
exports.del=function(collection,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		collection.remove(data,function(err, docs) {
			db.close()
			next(err,docs)
		})
	})
}