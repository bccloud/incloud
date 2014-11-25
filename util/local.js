module.exports=function(req, res, next){
		var ua = req.headers['user-agent'],
		$ = {};	
		if (/Android/.test(ua))$.os='Android';
		if (/webOS/.test(ua))$.os='webOS';
		if (/Windows NT/.test(ua))$.os='Windows';	
		if (/Windows Phone/.test(ua))$.os='Windows Phone';	
		if (/Mac/.test(ua)) {
			$.os='Mac'
			if(/iPhone/.test(ua))$.os='iPhone'
			if(/iPad/.test(ua))$.os='iPad'				
		}
		
		if (/MSIE/.test(ua))$.browser='IE';	
		if (/Trident/.test(ua))$.browser='IE';	
		if (/Safari/.test(ua)){
			$.browser='Safari';	
			if (/Android/.test(ua))$.browser='原生浏览器';
		}
		if (/Firefox/.test(ua))$.browser='Firefox';	
		if (/Chrome/.test(ua))$.browser='Chrome';
		if (/Opera/.test(ua))$.browser='Opera';	
		if (/OPR/.test(ua))$.browser='Opera';
		res.locals.v=$;		


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