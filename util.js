var config = require('./config')
	,CloudAPI = require('smartdc').CloudAPI
	,local = require('./local')
	,log4js = require('log4js')
	
log4js.configure({
  appenders: [
	{type: 'console'},//控制台
    {//文件输出
      type: 'file',filename: 'logs/log.log'
    }
  ]
})

exports.debug=function(location,er){
	console.log(er)
	var erstr=''
	try{erstr='错误信息：'+(er.constructor==Object?JSON.stringify(er):er)+'\n'}
	catch(e){erstr='错误信息：'+er+'\n'}
	finally{erstr+='位置：'+location+'\n****\n'}
	require('fs').appendFile('debug.log',erstr)
}
exports.locals=function(req, res, next) {
	res.locals.$= function(key) {//<%- function%>调用的方法
		return local.zh[key]||key
	}
	res.locals.fs= function(key) {
		 return require('fs').readFileSync(local.zh[key],'utf8')
	}
	next()
}
exports.caDeepCopy =function caDeepCopy(obj) {
	var ret, key
	if (obj && obj.constructor === Object) {
		ret = {}
		for (key in obj)
			ret[key] = caDeepCopy(obj[key])
		return ret
	}
	if (obj && obj.constructor === Array) {
		ret = []
		for (key = 0; key < obj.length; key++)
			ret.push(caDeepCopy(obj[key]))
		return ret
	}
	return obj
}
exports.cloud =function(user, pass, url) {
  var d = {};
  d.username = user;
  d.password = pass;
  d.url = url || config.cloudApi.url;
  d.logLevel = config.logLevel || "warn";
  return new CloudAPI(d);
}
exports.logger=function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('INFO');
  return logger;
}