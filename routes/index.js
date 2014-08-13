var express = require('express')
	,router = express.Router()
	,machine=require('./machine')
	,account = require('./account')
	,util = require('../util')
	,alipay = require('alipay').Alipay
	,accountio = require('./io/account')
//alipay = new alipay(app.get(alipay))
router.use(util.locals)//app.use([/path], function)为指定path（默认为所有）启用指定function
	.route('/login')
		.get(function(req, res) {
				req.session.account?
					res.redirect('/account'):
					res.render('login')
		})
		.post(accountio.loginIO)
router.use(account.authed)
	.get('/'
		,machine.dcs
		,machine.machines
		,function(req, res){
			res.render('index',{machines:req.session.machines})
	})
	.get('/account'
		,function(req, res){
			var accOptional = require('../local').accOptional
			res.render('account',{account:req.session.account,optionals:accOptional})
	})
	.get('/password'
		,function(req, res){
			res.render('password',{account:req.session.account})
		}
	)
	.get('/password_reset/:uuid/:code',
		account.validateForgotPasswordCode,
		util.render("password_reset")
	)
	.post('/password_reset/:uuid/:code',
		account.validateForgotPasswordCode,
		account.password_reset
	)
	.get('/sshkeys'
		,account.sshkey
	)
	.post('/sshkeys'
		,accountio.sshkeyIO
	)
	.get('/sshkeys/:id/del'
		,account.deleteKey
	)
	.get('/logout'
		,function(req, res){
			req.session.destroy();
			res.redirect('/login')
	})
	.get('/purchase'
		,machine.dcs
		,machine.datasets
		,machine.packages
		,machine.createView
	)
	.post('/purchase'
		//,machine.purchase(alipay)
		,machine.datasets
		,machine.packages
		,machine.create
	)
	.get('/machines'
		,machine.dcs
		,machine.machines
		,function(req, res){
				res.render('machines',{machines:req.session.machines})
	})
	.get('/:dc/machine/:id'
		,machine.dcs
		,machine.datasets
		,machine.packages
		,machine.machine
	)
	.post('/:dc/machine/:id'
		,machine.datasets
		,machine.packages
		,machine.resizePost
	)
	.get('/:dc/:id/reboot'
		,machine.reboot
	)
	.get('/:dc/:id/shutdown'
		,machine.shutdown
	)
	.get('/:dc/:id/startup'
		,machine.startup
	)
	.get('/:dc/:id/del'
		,machine.del
	)
	.get('/:dc/:id/refresh'
		,machine.refresh
	)
	.get('/:dc/:id/snapshot'
		,machine.snapshot
	)
router.use(util._404)
router.use(util.errs)
/*
alipay.route(app)
alipay.on('verify_fail', function(){console.log('emit verify_fail')})
	.on('create_direct_pay_by_user_trade_finished', function(out_trade_no, trade_no){})
	.on('create_direct_pay_by_user_trade_success', function(out_trade_no, trade_no){})	
	.on('refund_fastpay_by_platform_pwd_success', function(batch_no, success_num, result_details){})
	.on('create_partner_trade_by_buyer_wait_buyer_pay', function(out_trade_no, trade_no){})
	.on('create_partner_trade_by_buyer_wait_seller_send_goods', function(out_trade_no, trade_no){})
	.on('create_partner_trade_by_buyer_wait_buyer_confirm_goods', function(out_trade_no, trade_no){})
	.on('create_partner_trade_by_buyer_trade_finished', function(out_trade_no, trade_no){})
	.on('send_goods_confirm_by_platform_fail', function(error){res.send(error)})
	.on('send_goods_confirm_by_platform_success', function(out_trade_no, trade_no, xml){})
	.on('trade_create_by_buyer_wait_buyer_pay', function(out_trade_no, trade_no){})
	.on('trade_create_by_buyer_wait_seller_send_goods', function(out_trade_no, trade_no){})
	.on('trade_create_by_buyer_wait_buyer_confirm_goods', function(out_trade_no, trade_no){})
	.on('trade_create_by_buyer_trade_finished', function(out_trade_no, trade_no){});
*/	

module.exports = router;