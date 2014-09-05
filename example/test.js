function f(c,b){
	require('mongodb').MongoClient.connect(c, function(e, d) {
		b(d)
	})
}
var o={_id:11,user:'wangjh',shop:{期限:[{'max':'6'},{'min':'3'}]}}
f('mongodb://localhost/test', function(d) {
var used1=process.memoryUsage().heapUsed
var myDate1 = new Date()
console.log(used1)
		var c = d.collection('t');
		var a=c
		var d=new Date()
		console.log(d)
		d=d.getTime()
		console.log(d)
		c.findOne({_id:1}, function(err, docs) {
			if (err) throw err
			else console.log(docs)
		})
})