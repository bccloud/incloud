var config = require('../config')
	,capi = new (require('sdc-clients').CAPI)(config.capi)
	,CloudAPI = require('smartdc').CloudAPI

module.exports = {
	signupGet :function(req, res){
		res.render('account/signup')
	},	
	signupPost:function(req, res,next){
	  if (req.session.account) {
		delete req.session.account;
		delete req.session.username;
		delete req.session.password;
	  }
	  capi.createAccount(req.body, function(er, created) {
		if (er) {
			res.render("account/signup", { error:er.message,account : req.body.account });
			return;
		}
		req.session.account = created;
		req.session.username = created.login;
		req.session.password = account.password;
		next();
	  });
	},

	authed : function authed(req, res, next) {
	  if (req.session.account) {
		var cloudURL = config.cloudApi.url;
		if (req.params.dcName) {
		  cloudURL = req.session.dc.list[req.params.dcName];
		}
		req.cloud = new CloudAPI({
			username:req.session.username,
			password:req.session.password,
			url:cloudURL
		});
		return next();
	  }
		res.redirect('/login');
	},
	
	showKeys:function(req, res) {
	  req.cloud.listKeys(req.session.account, function (er, keys) {
		res.render("account/sshkeys", er?{ er : er }:{ keys : keys });
	  });
	},

	loginGet:function(req, res) {
		res.render('account/login');
	},
	
	loginPost:function(req, res,next) {
		var user = req.body.account.username;
		var pass = req.body.account.password;
		capi.authenticate(user, pass, function (er, account) {
			if (er || !account) {
			  if (er && er.httpCode != 404) {
				console.error("[Error]", er.message)
			  }
		res.render('account/login');
			}
			req.session.account = account;
			req.session.username = user;
			req.session.password = pass;
			var url = config.cloudApi.url;
			if (req.params.dcName) {
			  url = req.session.dc.list[req.params.dcName];
			}
			req.cloud = new CloudAPI({
				username:req.session.username,
				password:req.session.password,
				url:url,
				logLevel:"warn"
			});
			next();
		});
	},


}