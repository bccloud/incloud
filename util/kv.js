exports.KstrV =function(data) {
	var k=new Array(),v=new Array()
	for(var d in data){
		k.push(d)
		v.push("'"+data[d]+"'")
	}
	return {k:k.join(','),v:v.join(',')}
}
exports.KVstr =function(data,separator) {
	var kv=new Array();
	for(var d in data){
		d=d+'='+"'"+data[d]+"'"		
		kv.push(d)
	}
	return kv.join(separator)
}