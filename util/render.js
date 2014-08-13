exports.locals=function(req, res, next) {
	if(req.query.lan)
		req.session.lan=req.query.lan;
	var local = require('./local').lan[req.session.lan||'zh']
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
	res.locals.login= function() {
		return req.session.account.login
	}
	next()
}
exports._404=function(req, res) {
	res.status(404);
	res.render('err', {message: '404未找到：一起加入寻找失踪儿童的行列！'});
}
exports.errs=function(err, req, res,next) {
	logger('unknownHttp').error(err);
	res.status(err.status || 500);
	res.render('err', {message: '服务器异常：请稍候重试！'});
}
exports.render=function(path) {return function(req, res) {res.render(path)}}