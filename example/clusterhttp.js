if (require('cluster').isMaster)require('os').cpus().forEach(function(){require('cluster').fork()})
else {
	var http = require('http'),
		str = require('fs').readFileSync('index.ejs', 'utf8'),
		ejs = require('ejs')
	http.createServer(function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(ejs.render(str, {
		  user: require('url').parse(req.url,true).query.user
		}));
	}).listen(80);
}