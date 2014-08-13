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
exports.mail =function(message) {
	var nodemailer = require('nodemailer')
		,smtpTransport = nodemailer.createTransport("SMTP",{
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