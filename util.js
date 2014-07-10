var config = require('./config')
	,CloudAPI = require('smartdc').CloudAPI
	,local = require('./local')
	,log4js = require('log4js')
	,nodemailer = require('nodemailer')

log4js.configure({appenders: [
	{type: 'console'},//控制台
	{type: 'file',filename: 'logs/log.log'}//文件输出
]})
exports.logger=function(name){
  return log4js.getLogger(name);
}
exports.locals=function(req, res, next) {
	if(req.query.lan)
		req.session.lan=req.query.lan;
	res.locals.$= function(key) {//<%- function%>调用的方法
		return local[req.session.lan||'zh'][key]||key
	}
	res.locals.fs= function(key) {
		return require('fs').readFileSync(local[req.query.lan?req.query.lan:zh][key],'utf8')
	}
	res.locals.msg= function() {
		var msg=local[req.session.lan||'zh'][req.session.msg]||req.session.msg
		req.session.msg=''
		return msg;
	}
	res.locals.login= function() {
		return req.session.account.login
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
exports.mail =function(message) {
	var smtpTransport = nodemailer.createTransport("SMTP",{
		host: config.mail.host, // 主机
		secureConnection: true, // 使用 SSL
		port: config.mail.port, // SMTP 端口
		auth: {
			user: config.mail.user,
			pass: config.mail.pass
		}
	});
	console.log('sendMailing...')
	smtpTransport.sendMail(message, function(error, succ) {
		if(error){
			console.log(error);
		}else{
			console.log("Message sent: " + succ.message);
		}
		smtpTransport.close();
	})
}