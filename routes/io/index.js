module.exports = function(io){
	var account = require('./account')
	io.route('account',account.updateIO)
	io.route('login',account.loginIO)
	io.route('signup',account.signupIO)
	io.route('sshkey',account.sshkeyIO)
	io.route('password',account.passwordIO)
	io.route('reset',account.resetIO)
}