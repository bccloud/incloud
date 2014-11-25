var https = require('https');
var querystring = require('querystring'); 
var post_data = querystring.stringify({
     'login' : 'admin',
     'password' : '*************',
     }),
 post_option = {
  host: '192.168.77.108',
  path: '/login',
  method: 'POST',
  port: 80,
  headers: {
    'Authorization': 'Basic d2FuZ2poOndqaF9iY2M=',
	"Accept": "application/json"
  }}
 var post_req = https.request(post_option, function(res){
     res.on('data', function(buffer){
         console.log(buffer.toString());
         });
 })
 post_req.write(post_data);
 post_req.end();