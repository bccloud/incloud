var	data=require('querystring').stringify({
		account:"canfeit",
		password:'miracle600929',
		mobile:"15811503070",
		content:"您的订单编码：111。如需帮助请联系客服。"
	}),
	req=require('http').request({
		host: "sms.106jiekou.com",
		path: '/utf8/sms.aspx',
		port:80,
		method: "POST",
		headers:{
			'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8',
			'Content-length':data.length
		}
	},function (res){
		var body = ""
		res.on('data',function(data){body += data;})
			.on('end',function(){console.log(body)})
})
req.write(data)
req.end()