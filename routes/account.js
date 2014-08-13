var config = require('../config')
	,capi = new (require('sdc-clients').CAPI)(config.capi)
	,util = require('../util')
	,logger=util.logger('account')
	,db = require('../dao/db')
	
module.exports = {
	authed:function(req,res,next) {
		if (req.session.account){
			req.cloud = util.cloud(req.session.account.login, req.session.password)
			return next();
		}
		req.session.body=req.body
		req.session.url=req.url
		req.session.msg='请登录后继续！'
		res.redirect('/login');
	},
	sshkey:function(req, res) {
	  var cloud = util.cloud(req.session.account.login,req.session.password);
	  cloud.listKeys(req.session.account, function (er, keys) {
		res.render("sshkeys",{ keys : keys });
	  });
	},
	deleteKey:function(req, res) {
	  req.cloud.deleteKey(req.params.id, function (er, key) {
		if (er) {
		  //req.flash("error", er.message);
		} else {
		  //req.flash("info", "SSH Key successfully removed.");
		}
		res.redirect("/sshkeys");
	  });
	},
	validateForgotPasswordCode:function(req, res,next) {
	  new (require('sdc-clients').CAPI)(config.capi).getAccount(req.params.uuid, function (er, account) {
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
	console.log(req.body)
		var data=req.data||req.body
		capi.authenticate(data.login, data.password, function (er, account) {
			if(er) {
				logger.error(er)
				res.send('password')
			}else if (account) {
				db('users','select',{id:util.cipher(account.uuid)},function(err,doc){
					if(err)throw err
					if(doc){
						delete doc.email_address
						delete doc.login
						delete doc.id
						for(var d in doc){account[d]=util.decipher(doc[d])}
					}
					req.session.account = account;
					req.session.password = data.password
					req.session.msg='登录成功！'
					res.send(req.session.url||'/account')
					req.session.url=null
				})
			}
		})
	},
	signupIO:function(req) {
	  capi.createAccount(req.data, function(er, account) {
		if (account) {
			req.session.password = req.data.password;
			delete req.data.password_confirmation
			delete req.data.password
			req.data.id=account.uuid
			for(var d in req.data){req.data[d]=util.cipher(req.data[d])}
			db('users','insert',req.data,function(err,doc){
				if(err)throw err
				if(doc){
					delete req.data.email_address
					delete req.data.login
					delete req.data.id
					for(var d in req.data){account[d]=util.decipher(req.data[d])}
				}
				req.session.account = account;
				if(req.session.cookie){
					req.session.save(function(){
						req.io.respond('/sshkeys',true)
					})
				}else req.io.respond('/sshkeys',true)
			})
		}else {
			console.log(er)
			req.io.respond('password')
		}
	  })
	},
	sshkeyIO:function(req,res) {
	  var cloud = require('../../util').cloud(req.session.account.login,req.session.password);
	  cloud.createKey(req.data||req.body, function (er, key) {
		if (er){
			console.log("error", er.message);
			app.io.on('connection', function(socket){
				socket.emit('er',er.message)
			})
		}
		else req.io.respond('/sshkeys',true)
	  });
	},
	updateIO:function(req) {
		if(!req.session.account)return req.io.respond('/account',true)
		req.data.uuid=req.session.account.uuid
		capi.updateAccount(req.data, function (er, account) {
			if (er)req.io.respond('password')
			else{
				delete req.data.uuid
				for(var d in req.data){req.data[d]=util.cipher(req.data[d])}
				db('users','update',{set:req.data,where:{id:util.cipher(req.session.account.uuid)}},function(err,doc){
					if(err)throw err
					if(doc){
						delete req.data.email_address
						delete req.data.login
						for(var d in req.data){account[d]=util.decipher(req.data[d])}
					}
					req.session.account = account;
					req.session.msg = '个人资料更新成功！';
					req.session.save(function(){
						req.io.respond('/account',true)
					})
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
			if (er)req.io.respond('password')
			else{
			  req.session.account = account;
			  req.session.password =req.data.password
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
	}
}