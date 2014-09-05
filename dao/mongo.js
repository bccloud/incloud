function getCollection(callback) {
	require('mongodb').MongoClient.connect('mongodb'+require('../config/dburl'), function(err, db) {
		if(err)throw err
		else callback(db)
	})
}
exports.find=function(collection,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
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
exports.update=function(collection,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		collection.update(data.where,{$set:data.set},function(err, docs) {
			db.close()
			next(err,docs)
		})
	})
}
exports.upsert=function(collection,data,next){
	getCollection(function(db) {
		collection = db.collection(collection);
		collection.update(data.where,{$push:data.push},true,function(err, docs) {
			db.close()
			next(err,docs)
		})
	})
}