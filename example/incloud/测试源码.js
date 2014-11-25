var cloud = new (require('smartdc').CloudAPI)({
		url:'https://192.168.113.204',
		username:'wangjh',
		password:'wjh_bcc',
		logLevel:'warn'
	}),
	account={uuid: '3d3a42d7-80da-4e73-9de8-94e52b15edb1',
	  updated_at: '2014-10-16T10:55:35+00:00',
	  role: 1,
	  customer_id: 3,
	  login: 'wangjh',
	  approved_for_provisioning: true,
	  company_name: 'bcc',
	  created_at: '2014-06-09T06:22:51+00:00',
	  first_name: 'wang',
	  last_name: 'Jianhui',
	  id: 3,
	  activation_code: 'bce32e4e5ef827bc38ac17afd7f82e6c1111f15f',
	  email_address: '1507632849@qq.com' },
	machine={
		dataset: 'sdc:sdc:smartos:1.6.3',
		package: 'regular_1024' 
	};
	machine2={
		dataset: 'sdc:sdc:smartos:1.6.3',
		package: 'MICRO_512' 
	};
	machine3={
		dataset: 'ubuntu10.04:0.1.0',
		package: 'LARGE2_32768' 
	};
	machine4={
		dataset: 'ubuntu10.04:0.1.0',
		package: 'regular_128' 
	};

	cloud.listDatacenters(function(err, dc) {
		console.log('listDatacenters',err||dc)
		cloud.listDatasets(account, function (err, datasets) {
			console.log('listDatasets',err||datasets)
			cloud.listPackages(account, function (err, packages) {
				console.log('listPackages',err||packages)
				cloud.createMachine(account,machine,function (err, machineData) {
					console.log('\n======createMachine',machine,'======\n',err||machineData,'\n')
					cloud.createMachine(account,machine2,function (err, machineData) {
						console.log('\n======createMachine2',machine2,'======\n',err||machineData,'\n')
						cloud.createMachine(account,machine3,function (err, machineData) {
							console.log('\n======createMachine3',machine3,'======\n',err||machineData,'\n')
							cloud.createMachine(account,machine4,function (err, machineData) {
								console.log('\n======createMachine4',machine4,'======\n',err||machineData,'\n')
							})
						})
					})
				})
			})
		})
	})