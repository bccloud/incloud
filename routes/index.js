var express = require('express')
	,rout= express.Router()
	,machine=require('./machine')
	,account = require('./account')
rout.post('/code',function(req, res){
	var sms=require('../util/sms'),
	code=parseInt((Math.random()*9+1)*100000)
	sms(req.body.phone,'赢在云端验证码：'+code,function(){
	locals[req.body.phone]=code
		res.send('验证码发送成功！')
	})
})
rout.get('/ccap',function(req, res) {
var ccap = require('ccap')(),
	ary = ccap.get(),
	txt = ary[0],
	buf = ary[1];
	req.session.ccap=txt
    console.log(req.session.ccap);
    res.send(buf);
})
rout.get('/404',function(req, res) {res.render('404');})
rout.route('/captcha')
	.get(function(req, res){req.session.captcha=parseInt((Math.random()*4));res.end(req.session.captcha+'')})
	.post(function(req, res){res.end((req.body.captcha==req.session.captcha)+'')})
rout.get('/home',function(req,res){res.render('home')})
	.get('/chat',function(req,res){res.render('chat')})
	.post('/signup',account.signupIO)
	.route('/login')
	.get(account.login)
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
rout.route('/purchase/goshop')
	.get(machine.getgoshop)
	.post(machine.goshop)
rout.route('/purchase/:type')
	.get(machine.type)
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
rout.get('/clear/:type',machine.clear)

module.exports = rout;