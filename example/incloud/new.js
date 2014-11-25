//用户登录、新建主机（nodejs版、接口调用）
var capi = new (require('sdc-clients').CAPI)({
	url:"http://192.168.113.203:8080",
	username:"admin",
	password:"tot@ls3crit",
	logLevel:'warn'
});
capi.authenticate('test1354@126.com', 'test1354@126.com', function (er, account) {
    er?console.log(er):console.log(account.login);
	
	var cloud = new (require('smartdc').CloudAPI)({
			url:'https://192.168.113.204',
			username:'test1354@126.com',
			password:'test1354@126.com',
			logLevel:'warn'
		}),
		machine={
			datacenter: 'POC',
			dataset: 'sdc:jpc:centos-6:1.3.0',
			package: 'regular_256' 
		};
	(function createMachine(i){
		if(i){
			cloud.createMachine(account, machine,function (er, machineData) {
				if(!er && machineData) console.log('创建成功：',machineData)
				else console.log(er);
				createMachine(--i)
			})
		}
	})(1);
	
});