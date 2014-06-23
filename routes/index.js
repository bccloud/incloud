module.exports = function(app){
var machine=require('./machine')
	,util = require('../util')
	,account = require('./account')
	,dc = require('./dc')
	,logger=util.logger('index')
	
 app.use(util.locals)//app.use([/path], function)为指定path（默认为所有）启用指定function
	.get('/',function(req, res){res.render('index',{account:req.session.account})})
	.get('/signup', account.signupGet)
	.post('/signup'
		, account.signupPost
		,account.authed
		,account.showKeys
	)
	.get('/login',account.loginGet)
	.post('/login'
		,account.loginPost
		,dc.list
		,machine.fetchList
		,machine.list
	)
	.get('/machines/new'
		,account.authed
		,dc.getDatasetsAndPackages
		,machine.newMachine
	)
	.post('/machines'
		,account.authed
		,dc.getDatasetsAndPackages
		,machine.create
	)
	.get('/resize',function(req, res){
		if (!req.session.account) {
			res.redirect('/login');
		}
		res.render('machines/resize',{list:req.session.machines})
	})
	.post('/resize'
		,account.authed
		,dc.getDatasetsAndPackages
		,machine.resizePost
	)
	.get('/:id/reboot'
		,account.authed
		,dc.getDatasetsAndPackages
		,machine.reboot
	)
	.get('/:id/shutdown'
		,account.authed
		,dc.getDatasetsAndPackages
		,machine.shutdown
	)
	.get('/:id/startup'
		,account.authed
		,dc.getDatasetsAndPackages
		,machine.startup
	)　
	.io.route('account', function(req,res) {
		req.session.name = req.data
		req.session.save(function() {
			req.io.emit('account',{account:req.session.name})
			req.io.respond(req.session.name)
		})
　　})
}