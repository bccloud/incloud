module.exports=function(message) {
	var mail = require('../config/mail').mail
		,nodemailer = require('nodemailer')
		,smtpTransport = nodemailer.createTransport("SMTP",{
		host: mail.host, // 主机
		secureConnection: true, // 使用 SSL
		port: mail.port, // SMTP 端口
		auth: {
			user: mail.user,
			pass: mail.pass
		}
	});
	smtpTransport.sendMail(message, function(error, succ) {
		if(error){
			console.log(error);
		}else{
			console.log("Message sent: " + succ.message);
		}
		smtpTransport.close();
	})
}