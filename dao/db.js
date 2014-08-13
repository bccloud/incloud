module.exports=function(table,opera,data,next){
	var sql='',util = require('./util')
	switch(opera){
	case 'insert':
		sql=util.KstrV(data)
		sql='insert into '+table+'('+sql.k+') values('+sql.v+')'
		break
	case 'select':
		sql='select * from '+table+' where '+util.KVstr(data,' and ')
		break
	case 'update':
		sql='update '+table+' set '+util.KVstr(data.set,',')+' where '+util.KVstr(data.where,' and ')
		break
	}
	require('./pg')('postgres'+require('../config').dburl,sql,next)
}