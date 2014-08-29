function getCollection(con,callback) {
	require('mongodb').MongoClient.connect(con, function(err, db) {
		if(err)throw err
		else callback(db)
	})
}
exports.find=function(con,collection,data,next){
	getCollection(con, function(db) {
		collection = db.collection(collection);
		collection.find(data).toArray(function(err, docs) {
			db.close()
			if (err) throw err
			else {
				next(docs[0])
			}
		})
	})
}
exports.update=function(con,collection,data,next){
	getCollection(con, function(db) {
		collection = db.collection(collection);
		collection.update(data.where,{$set:data.set},function(err, docs) {
			db.close();
			if (err) throw err
			else{
				next(docs)
			}
		})
	})
}