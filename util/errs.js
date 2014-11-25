exports._404=function(req, res) {res.status(404);res.render('404');}
exports.err=function(err, req, res,next) {
	console.error(err)
	res.status(err.status || 500);
	res.render('err', {message: '服务器异常：请稍候重试！'});
}