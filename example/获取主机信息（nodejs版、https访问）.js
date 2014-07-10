var https = require('https')
var req = {
  host: '192.168.113.204',
  path: '/wangjh/machines',
  headers: {
    'x-api-version': '~6.5',
    'Authorization': 'Basic d2FuZ2poOndqaF9iY2M=',
	"Accept": "application/json"
  }
};
https.get(req, function(res) {
  res.setEncoding('utf8');
  res.body = '';
  res.on('data', function(chunk) {
    res.body += chunk;
  });
  res.on('end', function() {
    console.log(res.body);
  });
}).end();