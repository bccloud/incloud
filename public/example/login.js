var capi = new (require('sdc-clients').CAPI)({
	url:"http://192.168.113.203:8080",
	username:"admin",
	password:"tot@ls3crit",
	logLevel:'warn'
});
capi.authenticate('wangjh', 'wjh_bcc', function (er, account) {
    if(!er && account) console.log(account);
});