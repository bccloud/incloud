var	md5=require('crypto').createHash('md5'),
	pwd='miraclet0',
	req=require('http').request({
		host: "106.ihuyi.cn",
		path: '/webservice/sms.php?method=Submit',
		port:80,
		method: "POST",
		headers:{
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
		}
	},function (res){
		var body = ""
		res.on('data',function(data){body += data;})
			.on('end',function(){console.log(body)})
})
md5.update(pwd)
pwd=md5.digest('hex')
req.write(require('querystring').stringify({
	account:"cf_canfeit",
	password:pwd,
	mobile:"15811503070",
	content:"您的验证码是："+
		parseInt((Math.random()*9+1)*100000)+
		"。请不要把验证码泄露给其他人。"
}))
req.end()