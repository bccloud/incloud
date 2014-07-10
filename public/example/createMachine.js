var cloudAPI=require('smartdc').CloudAPI,
	cloud = new cloudAPI({
		username:'wangjh',
		password:'wjh_bcc',
		url:'https://192.168.113.204',
		logLevel:'warn'
	}),
	machine={ 
		datacenter: 'POC',
		dataset: 'sdc:sdc:smartos:1.3.18',
		package: 'regular_128' 
	};
cloud.createMachine(account,machine,function (er, machineData) {
	if(!er && machineData) console.log(machineData);
});