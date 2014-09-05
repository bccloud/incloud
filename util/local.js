module.exports=function(req, res, next){
	var os = require('os'),local=null
	if(req.query.l)req.session.lan=req.query.l
	if(
		os.freemem()/os.totalmem()<=0.15||
		process.memoryUsage().heapUsed/process.memoryUsage().heapTotal>=0.97
	){
		locals=null
		local = require('../config/lan')[req.session.lan||'zh'] 
	}else{
		locals?null:locals=require('../config/lan')
		local = locals[req.session.lan||'zh']
	}
	res.locals.$= function(key){return local[key]||key}//<%- function%>调用的方法
	if(req.session.msg){
		res.locals.msg=local[req.session.msg]||req.session.msg
		req.session.msg=''
	}else res.locals.msg=''
	next()
}