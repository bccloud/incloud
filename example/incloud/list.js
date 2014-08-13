//用户登录、获取主机信息
var capi = new (require('sdc-clients').CAPI)({
	url:"http://192.168.113.203:8080",
	username:"admin",
	password:"tot@ls3crit",
	logLevel:'warn'
});
capi.authenticate('wangjh', 'wjh_bcc', function (er, account) {
    account?console.log(account.login):console.log(er);
	
	var cloud = new (require('smartdc').CloudAPI)({
			url:'https://192.168.113.204',
			username:'wangjh',
			password:'wjh_bcc',
			logLevel:'warn'
		})
	cloud.listMachines(function(er, machines, lastPage) {
		er?console.log(er):console.log(machines)
	})
	
});