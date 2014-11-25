var https = require('https'),
	querystring = require('querystring');
var post_data = querystring.stringify({
     'login' : 'admin',
     'password' : '************',
});
post_option ={
  host: '192.168.113.201',
  path: '/login',
  method: 'POST',
  port: 80
}
 var post_req = https.request(post_option, function(res){ 
    res.on('data', function(buffer){
         console.log(buffer.toString());
    });
 })
 post_req.write(post_data);
 post_req.end();