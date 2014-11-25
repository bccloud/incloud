var md5=require('crypto').createHash('md5'),
	pwd='miraclet0',
	uid='canfeit',
	http = require('http');
md5.update(pwd+uid)
pwd=md5.digest('hex')
console.log(pwd)
var querystring = require('querystring');
var postData = {
    uid:uid,
    pwd:pwd,
    mobile:'15811503070',
	encode:'utf8',
	content:'您正在设置手机验证，验证码为:123,请及时验证，有效期三十分钟【我在吃】'
};
var content = querystring.stringify(postData);
var options = {
    host:'api.sms.cn',
    path:'/mt/',
    method:'POST',
    headers:{
        'Content-Type' : 'application/x-www-form-urlencoded', 
        'Content-Length' :content.length
    }
};
var req = http.request(options,function(res){
		var body = ""
		res.on('data',function(data){body += data;})
			.on('end',function(){console.log(body)})
});
req.write(content);
req.end();