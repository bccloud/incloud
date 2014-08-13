var util = require('../util')
	,debug=util.debug
	,md5 = require('crypto').createHash('md5')//生成散列值来加密密码
	,local = require('../local')
	,config = require('../config')
	,capi = new (require('sdc-clients').CAPI)(config.capi)
module.exports = {
	dcs : function(req, res,next) {
		if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
		if(!req.session.dc)req.cloud.listDatacenters(function(err, dc) {
			if (err)return 
			req.session.dc =dc
			next()
		})
		else next()
	},
	datasets:function (req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
		if(!req.session.datasets)req.cloud.listDatasets(req.session.account, function (er, datasets) {
			if (er) return
			req.session.datasets = datasets;
			next();
		})
		else next()
	},
	packages:function (req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
		if (!req.session.packages)req.cloud.listPackages(req.session.account, function (er, packages) {
			if (er) return;
			req.session.packages = packages;
			next();
		})
		else next()
	},
	createView:function(req, res, next) {
	  var dcNames = Object.keys(req.session.dc)
	  res.render("purchase.ejs",{ datacenters: dcNames,
					 datasets: req.session.datasets,
					 packages: req.session.packages });
	},
	purchase:function(alipay) {
		return function(req, res){
			console.log(alipay)
		}
		
		//alipay.create_direct_pay_by_user(data, res);
	},
	create : function(req, res) {
	  var cloud=(req.body.machine.datacenter== ""?
			req.cloud:
			util.cloud(req.session.account.login, req.session.password, req.session.dc[req.body.machine.datacenter]))
	  cloud.createMachine(req.session.account,req.body.machine,function (er, machine) {
		if (er) {
		  res.redirect('/purchase');
		}
		res.redirect('/machines')
	  });
	},
	machines:function(req, res,next){
		var dcNames = Object.keys(req.session.dc),
			newMachines =  {},
			todo = dcNames.length,
			done = 0;
		dcNames.forEach(function(name) {
			var dc =util.cloud(req.session.account.login, req.session.password,req.session.dc[name])
			dc.listMachines(function(er,machines,lastPage) {
				if(lastPage&&!er&&machines)
					newMachines[name] =machines
				if(++done===todo){
					req.session.machines = newMachines;
					next();
				}
			})
		})
		
	},
	machine:function(req, res,next){
		//if(!req.cloud)req.cloud = util.cloud (req.session.account.login, req.session.password)	
		req.cloud.getMachine(req.session.account,req.params.id,false,function (er, machine, headers) {
			if (er && er.message.state === 'deleted') {
			  //res.render(util.view("machines/gone.ejs"));
			} else if (er && er.httpCode === 404) {
			  //return next(new errs.NotFound(req.url));
			} else if (er ) {
			  //return next(new errs.CloudAPIError(errState = er));
			} else {
			  if (machine.metadata)
				machine.metadata["user-script"] = null;
			  machine.dc = req.params.dc;
			  res.render("machine",
				{ machine: machine,
				   packages: req.session.packages,
				   datasets: req.session.datasets,
				   tags:req.session.tag });
			}
		  });
	},
	resizePost:function(req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
		if (!req.body) {
			//return res.redirect('/resize');
		}
		req.cloud.resizeMachine(req.session.account,req.params.id,{package:req.body.package},function (er, machine) {
				if (er) {
				  console.log(er.message);
				} else {
				  console.log('Your machine is being resized ');
				}
				res.redirect(req.url);
			}
		);
	},
	reboot:function(req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
	  req.cloud.rebootMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		// need to send datacenter here too.
		res.redirect('/'+req.params.dc+'/machine/'+req.params.id);
	  });
	},
	shutdown:function(req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
	  req.cloud.stopMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		// need to send datacenter here too.
		res.redirect('/'+req.params.dc+'/machine/'+req.params.id);
	  });
	},
	startup:function(req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
	  req.cloud.startMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		// need to send datacenter here too.
		res.redirect('/'+req.params.dc+'/machine/'+req.params.id);
	  });
	},
	del:function(req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)
	  req.cloud.deleteMachine(req.session.account,
							  req.params.id,
							  function (er) {
		if (er) {
		  switch (er.httpCode) {
			case 409:
			case 410:
			case 404:
			  er = null;
		  }
		}
		if (er) return //next(er);

		res.redirect('/machines');
	  });
	},
	refresh:function(req, res, next) {
		//if(!req.cloud)req.cloud = util.cloud(req.session.account.login, req.session.password)

		res.redirect('/'+req.params.dc+'/machine/'+req.params.id);
	},
	snapshot:function(req, res, next){
		req.cloud.createMachineSnapshot(req.session.account,
							  req.params.id,{a:'a'},function(){})
	}


}