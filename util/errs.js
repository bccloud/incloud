exports._404=function(req, res) {
	res.status(404);
	res.render('err', {message: '404未找到：一起加入寻找失踪儿童的行列！'});
}
exports.err=function(err, req, res,next) {
	console.error(err)
	res.status(err.status || 500);
	res.render('err', {message: '服务器异常：请稍候重试！'});
}