var	req=require('http').request({
		host: "utf8.sms.webchinese.cn",
		path: '/',
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
req.write(data=require('querystring').stringify({
	Uid:"canfeit",
	Key:"48fb8b08ea82cb4be37f",
	smsMob:"18765843217,13824826627,13156018131,15969911132",
	smsText:"每个人的书屋，您与自然交流之处。静心读书，品味此处。优惠券:"+parseInt((Math.random()*9+1)*100000)+"，登录www.herebookstore.com使用。【此处书屋】"
}))
req.end()