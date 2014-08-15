module.exports=function(req, res, next) {
	if(req.query.lan)
		req.session.lan=req.query.lan;
	var local = require('../config/lan')[req.session.lan||'zh']
	res.locals.$= function(key) {//<%- function%>调用的方法
		return local[key]||key
	}
	res.locals.msg= function() {
		if(req.session.msg){
			var msg=local[req.session.msg]||req.session.msg
			req.session.msg=''
			return msg
		}else return ''
	}
	next()
}