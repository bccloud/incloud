var config = require('../config')
	,capi = new (require('sdc-clients').CAPI)(config.capi)
	,dc = require('./dc')
	,util = require('../util')
	,logger=util.logger('account')

module.exports = {
	authed:function(req,res,next) {
		if (req.session.account)
			return next();
		req.session.url=req.url
		req.session.msg='请登录后继续！'
		res.redirect('/login');
	},
	loginIO:function(req) {
		var user = req.data.username;
		var pass = req.data.password;
		capi.authenticate(user, pass, function (er, account) {
			if (account) {
				req.session.account = account;
				req.session.password = pass;
				req.session.msg='登录成功！'
				req.session.save(function(){
					if(req.session.url){
						req.io.respond(req.session.url,true)
						req.session.url=null
					}else
						req.io.respond('/account',true)
				})
			}else req.io.respond('password')
		});
	},
	signupIO:function(req) {
	  capi.createAccount(req.data, function(er, account) {
		if (account) {
			req.session.account = account;
			req.session.password = req.data.password;
			req.session.save(function(){
				req.io.respond('/sshkeys',true)
			})
		}else {
			console.log(er)
			req.io.respond('password')
		}
	  });
	},
	sshkey:function(req, res) {
	  var cloud = util.cloud(req.session.account.login,req.session.password);
	  cloud.listKeys(req.session.account, function (er, keys) {
		res.render("sshkeys",{ keys : keys });
	  });
	},
	sshkeyIO:function(req) {
	  var cloud = util.cloud(req.session.account.login,req.session.password);
	  cloud.createKey(req.data, function (er, key) {
		if (er) {
			console.log("error", er.message);
		}else{	
			req.io.respond('/sshkeys',true)
		}
	  });
	},
	updateIO:function(req) {
		req.data.uuid=req.session.account.uuid
		capi.updateAccount(req.data, function (er, account) {
			if (er) {
			  req.io.respond('password')
			}else{
			  req.session.account = account;
			  req.session.msg = '个人资料更新成功！';
			  req.session.save(function(){
				req.io.respond('/account',true)
			  })
			}
		});
	},
	passwordIO:function(req) {
		var pwd = req.session.password;
		if (req.data.current_password != pwd) {
			return req.io.respond('password')
		}
		req.data.uuid=req.session.account.uuid
		capi.updateAccount(req.data, function (er, account) {
			if (er) {
			  req.io.respond('password')
			}else{
			  req.session.account = account;
			  req.session.msg = '密码修改成功！';
			  req.session.save(function(){
				req.io.respond('/account',true)
			  })
			}
		});
	},
	resetIO:function (req) {
	  var identifier = req.data.identifier;
	  var errState = null;
	  var n = 2;
	  var results = {};	  
	  capi.findCustomer({ login: req.data.identifier },true,then);
	  capi.findCustomer({ email_address: req.data.identifier },true,then)
	  function then (er, accounts) {
		if (errState) return;
		if (er) {
		  return console.log(errState = er);
		}
		accounts.forEach(function (a) {
		  results[a.uuid] = a;
		});
		if (--n > 0) return;
		var ids = Object.keys(results);
		switch (ids.length) {
		  case 1:
			  capi.requestPasswordReset(results[ids[0]], function (er, account) {
				var resetLink = config.externalUrl +'/password_reset/' +account.uuid +'/' + account.forgot_password_code;
				require('fs').readFile(config.passResetMail,'utf8', function (err, data) {
					if (err) {
						logger.error(err)
						data =account.login+"：你好，<a href='${resetLink}'>找回密码</a>:{resetLink}。<br>--incloud"
					}
					data = data.replace(/{resetLink}/g, resetLink);
					data=data.replace(/{login}/g, account.login);
					var message = {
						from:config.mail.user,
						to : account.email_address,
						subject : "Password reset instructions",
						html : data
					};
					util.mail(message)
				});
			  });
			break;
		  case 0:
			console.log("error", "We couldn't find an account for " +
							   "this email/username.");
			break;
		  default:
			console.log("error", "The identifier supplied is attached to " +
							   "more than one account, please contact " +
							   "support.");
			break;
		}
	  }
	},
	validateForgotPasswordCode:function(req, res) {
	  capi.getAccount(req.params.uuid, function (er, account) {
	  console.log(account)
		if (er) return console.log("not found");
		if (account.forgot_password_code !== req.params.code) {
		  console.log("error", "Your code has either expired, already " +
							 "been used, or has been re-issued. " +
							 "You will need a new code.");
		} else {
			res.render("password_reset.ejs")
		}
	  });
	},
	validateForgotPasswordCode2:function(req, res) {
	  capi.getAccount(req.params.uuid, function (er, account) {
		if (er) return console.log("not found");
		if (account.forgot_password_code !== req.params.code) {
		  console.log("error", "Your code has either expired, already " +
							 "been used, or has been re-issued. " +
							 "You will need a new code.");
		} else {
		  if (req.body.password_confirmation !== req.body.password) {
			return res.redirect(req.url);
		  }
		  req.body.uuid=req.params.uuid
		  //req.body.forgot_password_code=''
		  capi.updateAccount(req.body, function(err, acct) {
			if (err) {
			console.log(err)
			  res.redirect(req.url);
			} else {
			  req.session.account = acct;
			  req.session.password = req.body.password;
			  res.redirect("/");
			}
		  });
		}
	  });
	}

}