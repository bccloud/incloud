module.exports = function(app){
var machine=require('./machine')
	,util = require('../util')
	,account = require('./account')
	,dc = require('./dc')
	,logger=util.logger('index')
	
 app.use(util.locals)//app.use([/path], function)为指定path（默认为所有）启用指定function
	.get('/'
		,account.authed
		,function(req, res){
			res.render('index')
	})
	.get('/login'
		,function(req, res) {
			res.render('login')
	})
	.get('/account'
		,account.authed
		,function(req, res){
			res.render('account',{account:req.session.account})
	})
	.get('/logout'
		,function(req, res){
			req.session.destroy();
			res.redirect('/login')
	})
	.get('/sshkeys'
		,account.authed
		,account.sshkey
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
	.get('/resize'
		,account.authed
		,function(req, res){
		res.render('resize',{id:'resize',list:req.session.machines})
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
	.get('/password'
		,account.authed
		,function(req, res){
			res.render('password',{account:req.session.account})
		}
	)
	.get('/password_reset/:uuid/:code',
		account.validateForgotPasswordCode
	)
	.post('/password_reset/:uuid/:code',
		account.validateForgotPasswordCode2
	)
	app.io.route('account',account.updateIO)
	app.io.route('login',account.loginIO)
	app.io.route('signup',account.signupIO)
	app.io.route('sshkey',account.sshkeyIO)
	app.io.route('password',account.passwordIO)
	app.io.route('reset',account.resetIO)
}