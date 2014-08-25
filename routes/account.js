var config = require('../config/mail')
	,capi = new (require('sdc-clients').CAPI)(require('../config/capi'))
	,crypto = require('../util/crypto')
	,cloud=require('../util/cloud')
	,db = require('../dao/db')
module.exports = {
	unth:function(req,res,next){
		if (req.session.account){
			req.cloud = cloud(req.session.account.login, req.session.password)
			res.locals.login= function() {return req.session.account.login}
			res.locals.login=req.session.account.login
			return next()
		}
		req.session.body=req.body
		req.session.url=req.url
		req.session.msg='请登录后继续！'
		return true
	},
	sshkey:function(req, res) {
	  req.cloud.listKeys(req.session.account, function (er, keys) {
		res.render("sshkey",{ keys : keys });
	  });
	},
	deleteKey:function(req, res) {
	  req.cloud.deleteKey(req.params.id, function (er, key) {
		if (er) {
		  //req.flash("error", er.message);
		} else {
		  //req.flash("info", "SSH Key successfully removed.");
		}
		res.redirect("/sshkey");
	  });
	},
	validateForgotPasswordCode:function(req, res,next) {
	  new (require('sdc-clients').CAPI)(require('../config/capi')).getAccount(req.params.uuid, function (er, account) {
		if (er) return console.log("not found");
		if (account.forgot_password_code !== req.params.code) {
		  console.log("error", "Your code has either expired, already " +
							 "been used, or has been re-issued. " +
							 "You will need a new code.");
		} else {
			next()
		}
	  });
	},
	password_reset:function(req, res) {
		  req.body.uuid=req.params.uuid
		  capi.updateAccount(req.body, function(err, acct) {
			if (err) {
				console.log(err)
			  res.redirect(req.url);
			} else {
				req.session.destroy();
			  res.redirect("/login");
			}
		  });
	},
	loginIO:function(req,res) {
		capi.authenticate(req.body.login, req.body.password, function (er, account) {
			if(er) {
				console.error(er)
				res.send('password')
			}else if (account) {
				db('users','select',{id:crypto.cipher(account.uuid)},function(err,doc){
					if(err)throw err
					if(doc){
						delete doc.email_address
						delete doc.login
						delete doc.id
						for(var d in doc){account[d]=crypto.decipher(doc[d])}
					}
					req.session.account = account;
					req.session.password = req.body.password
					req.session.msg='登录成功！'
					res.send(req.session.url||'/account')
					req.session.url=null
				})
			}else {
				console.log(req.body)
				res.send('password')
			}
		})
	},
	signupIO:function(req,res) {
	  capi.createAccount(req.body, function(er, account) {
		if(er) {
			console.error(er)
			res.send('password')
		}else if (account) {
			req.session.password = req.body.password;
			delete req.body.password_confirmation
			delete req.body.password
			req.body.id=account.uuid
			for(var d in req.body){req.body[d]=crypto.cipher(req.body[d])}
			db('users','insert',req.body,function(err,doc){
				if(err)throw err
				if(doc){
					delete req.body.email_address
					delete req.body.login
					delete req.body.id
					for(var d in req.body){account[d]=crypto.decipher(req.body[d])}
				}
				req.session.account = account;
				res.send('/sshkey')
			})
		}else {
			console.log(req.body)
			res.send('password')
		}
	  })
	},
	sshkeyIO:function(req,res) {
	  req.cloud.createKey(req.body, function (er, key) {
		if (er){
			console.error(er)
			res.send('password')
		}else res.send('/sshkey')
	  });
	},
	updateIO:function(req,res) {
		req.body.uuid=req.session.account.uuid
		capi.updateAccount(req.body, function (er, account) {
			if (er)res.send('password')
			else{
				delete req.body.uuid
				for(var d in req.body){req.body[d]=crypto.cipher(req.body[d])}
				db('users','update',{set:req.body,where:{id:crypto.cipher(req.session.account.uuid)}},function(err,doc){
					if(err)throw err
					if(doc){
						delete req.body.email_address
						delete req.body.login
						for(var d in req.body){account[d]=crypto.decipher(req.body[d])}
					}
					req.session.account = account;
					req.session.msg = '个人资料更新成功！';
					res.send('/account')
				})
			}
		});
	},
	passwordIO:function(req,res) {
		var pwd = req.session.password;
		if (req.body.current_password != pwd) {
			return res.send('password')
		}
		req.body.uuid=req.session.account.uuid
		capi.updateAccount(req.body, function (er, account) {
			if (er)req.io.respond('password')
			else{
				req.session.account = account;
				req.session.password =req.body.password
				req.session.msg = '密码修改成功！';
				res.send('/account')
			}
		});
	},
	resetIO:function (req,res) {
	  var identifier = req.body.identifier;
	  var errState = null;
	  var n = 2;
	  var results = {};	  
	  capi.findCustomer({ login: req.body.identifier },true,then);
	  capi.findCustomer({ email_address: req.body.identifier },true,then)
	  function then (er, accounts) {
		if (errState) return;
		if (er)return console.log(errState = er);
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
						console.error(err)
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
					require('../util/mail')(message)
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
	}
}