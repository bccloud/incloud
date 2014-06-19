var util = require('../util')
	,debug=util.debug
	,md5 = require('crypto').createHash('md5')//生成散列值来加密密码
	,local = require('../local')
	,config = require('../config')
	,capi = new (require('sdc-clients').CAPI)(config.capi)
	,CloudAPI = require('smartdc').CloudAPI
module.exports = {
	fetchList:function(req, res,next){
	  var dcNames = Object.keys(req.session.dc.list);
	  var todo = dcNames.length;//所有datacenters的数量
	  var done = 0;
	  var newMachines = { datacenters: {}, total: 0 };

	  var allPages = function(name, dc, listOptions) {
		var opts = util.caDeepCopy(listOptions);//opts=listOptions

		// get all the pages.
		return function doneListing(er, machines, lastPage) {

		  var errors;
		  var foundMachines = er ? 0 : machines.length;
		  newMachines.total += foundMachines;//所有datacenters的machines的数量

		  // TODO: error here
		  if (!newMachines.datacenters[name]) {
			newMachines.datacenters[name] = {
			  count : 0,
			  er : undefined,
			  machines : []
			}
		  }

		  newMachines.datacenters[name].count += foundMachines;//当前datacenters的machines的数量
		  newMachines.datacenters[name].er = er;
		  newMachines.datacenters[name].machines = newMachines.datacenters[name].machines.concat(machines);

		  done += 1;//返回的主机的总页数

		  if (!er && !lastPage) {
			todo += 1;
			opts.offset += opts.limit;
			return dc.listMachines(opts, allPages(name, dc, opts));//获取下一页machines
		  }

		  if (done === todo) {//所有主机获取完毕
			errors = Object.keys(newMachines.datacenters).reduce(function(acc, dcName) {
			  if (newMachines.datacenters[name].er) acc.push(er);
			  return acc;
			}, []);//获取newMachines.datacenters的er

			req.session.machines = newMachines;

			if (errors.length === dcNames.length) {
			  console.error("ERROR - failed all calls to cloud.listMachines.");
			
			  return next();
			}
			return next();
		  }
		}
	  }

	  dcNames.forEach(function(name) {
		var dc =new CloudAPI({
			username:req.session.username,
			password:req.session.password,
			url:req.session.dc.list[name],
			logLevel:"warn"
		});

		var listOpts = {
		  offset : 0,//从第几太机器开始返回
		  limit : config.machineQueryLimit || 200,//每次返回machines数量
		};

		dc.listMachines(listOpts, allPages(name, dc, listOpts));//获取当前datacenters第一批machines
	  });
	},
	list:function(req, res){
	  var dcNames = Object.keys(req.session.machines.datacenters);
	  var machines = dcNames.reduce(function(acc, name) {
		var arr = req.session.machines.datacenters[name].machines.map(function(m) {
		  var _m = util.caDeepCopy(m);
		  _m.datacenter = name;
		  return _m;
		});

		return acc.concat(arr);
	  }, []);
	  var n = 0, len = machines.length;
	  machines.forEach(function (machine) {
		req.cloud.listMachineTags(req.session.account, machine.id, function(er, tags) {
		  machine.tags = tags;
		  n++;
		  if (len == n) {
			res.render('dc/dclist',{machinelist:machines,dclist:req.session.dc})
		  }
		})
	  });
	},
	create : function(req, res) {
	  var cloud;
	  if (req.body.machine.datacenter != "") {
		var url = req.session.dc.list[req.body.machine.datacenter];
		cloud = util.cloud(req.session.username, req.session.password, url);
	  } else {
		cloud = req.cloud; // default from Config.
	  }

	  req.session.formInfo = req.body.machine;

		console.log(req.session.account)
		console.log(req.body.machine)
	  cloud.createMachine(req.session.account,
						  req.body.machine,
						  function (er, machine) {

		if (er) {
		  res.redirect('/machines/new');
		}
		console.log(machine)
		res.redirect('login')
	  });
	},
	newMachine:function(req, res, next) {
	  var dcNames = Object.keys(req.session.dc.list).sort();
	  var sortPriority = [
		function smartosFirst(a, b) {
		  if (a.os == b.os) return 0;
		  if (a.os === 'smartos') return -1;
		  if (b.os === 'smartos') return 1;
		  return a.os > b.os ? 1 : -1;;
		},
		function byNameAsc(a, b) {
		  if (a.name == b.name) return 0;
		  return a.name > b.name ? 1 : -1;
		},
		function byVersionDesc(a, b) {
		  if (a.version == b.version) return 0;
		  return a.version < b.version ? 1 : -1;
		}
	  ]

	  function sortDatasets(a, b) {
		var res;
		return sortPriority.reduce(function(acc, f) {
		  if (acc) return acc;
		  return f(a, b);
		}, 0);
	  }

	  res.render("machines/new.ejs",
				   { datacenters: dcNames,
					 datasets: req.session.datasets.sort(sortDatasets),
					 packages: req.session.packages });
	},
	resizePost:function(req, res, next) {
		if (!req.body) {
			return res.redirect('/resize');
		}
		req.cloud.resizeMachine(req.session.account,
			req.body.machine,
			{package:req.body.package},
			function (er, machine) {
				if (er) {
				  console.log(er.message);
				} else {
				  console.log('Your machine is being resized ');
				}
				res.redirect('/resize');
			}
		);
	},
	reboot:function(req, res, next) {
	  req.cloud.rebootMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		// need to send datacenter here too.
		res.send({account:req.session.account,id: req.params.id,status:status}, status);
	  });
	},
	shutdown:function(req, res, next) {
	  req.cloud.stopMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		// need to send datacenter here too.
		res.send({id: req.params.id,status:status}, status);
	  });
	},
	startup:function(req, res, next) {
	  req.cloud.startMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		// need to send datacenter here too.
		res.send({id: req.params.id,status:status}, status);
	  });
	}


}