var express = require('express')
	,rout= express.Router()
	,machine=require('./machine')
	,account = require('./account')
rout.get('/home',function(req,res){res.render('home')})
	.get('/chat',function(req,res){res.render('chat')})
	.post('/signup',account.signupIO)
	.route('/login')
	.get(function(req, res) {req.session.account?res.redirect('/account'):res.render('login')})
	.post(account.loginIO)
rout.post('/reset',account.resetIO)
	.route('/password_reset/:uuid/:code')
	.get(
		account.validateForgotPasswordCode,
		function(req,res){res.render('password_reset')}
	)
	.post(
		account.validateForgotPasswordCode,
		account.password_reset
	)
rout.route('/*')
	.get(function(req,res,next) {if(account.unth(req,res,next))res.redirect('/login')})
	.post(function(req,res,next) {if(account.unth(req,res,next))res.send('login')})
rout.get('/'
		,machine.dcs
		,machine.machines
		,function(req, res){res.render('index',{machines:req.session.machines})}
	)
	.route('/account')
	.get(function(req, res){res.render('account',{account:req.session.account,optionals:require('../config/accOptional')})})
	.post(account.updateIO)
rout.route('/password')
	.get(function(req, res){res.render('password',{account:req.session.account})})
	.post(account.passwordIO)
rout.route('/sshkey')
	.get(account.sshkey)
	.post(account.sshkeyIO)
rout.get('/sshkeys/:id/del',account.deleteKey)
	.get('/logout',function(req, res){
			req.session.destroy();
			res.redirect('/login')
	})
	.route('/purchase')
	.get(machine.dcs
		,machine.datasets
		,machine.packages
		,machine.createView
	)
	.post(machine.datasets
		,machine.packages
		,machine.create
	)
rout.route('/purchase/:type')
	.get(machine.type)
	.post(machine.goshop)
rout.get('/machines'
		,machine.dcs
		,machine.machines
		,function(req, res){res.render('machines',{machines:req.session.machines,page:req.query.p})})
	.route('/:dc/machine/:id')
	.get(machine.dcs
		,machine.datasets
		,machine.packages
		,machine.machine
	)
	.post(machine.datasets
		,machine.packages
		,machine.resizePost
	)
rout.get('/:dc/:id/reboot',machine.reboot)
	.get('/:dc/:id/shutdown',machine.shutdown)
	.get('/:dc/:id/startup',machine.startup)
	.get('/:dc/:id/del',machine.del)
	.get('/:dc/:id/refresh',machine.refresh)
	.get('/:dc/:id/snapshot',machine.snapshot)
module.exports = rout;