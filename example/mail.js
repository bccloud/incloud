var nodemailer = require('nodemailer')

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({host: 'smtp.126.com', // 主机
		//secureConnection: true, // 使用 SSL
		port: '25', // SMTP 端口
		auth: {
			user: 'canfeit@126.com',
			pass: 'miraclet0'
		}
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'canfeit@126.com', // sender address
    to: 'canfeit@126.com', // list of receivers
    subject: 'test对象存储', // Subject line
    text: 'Hello world', // plaintext body
    html: '<b>Hello world</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});