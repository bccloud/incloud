var cloud=require('../util/cloud')
,limit=require('../config/limit')
,date=require('../util/date')
module.exports = {
	dcs:function(req, res,next){
		if(!req.session.dc)req.cloud.listDatacenters(function(err, dc) {
			if (err)return 
			req.session.dc =dc
			next()
		})
		else next()
	},
	datasets:function (req, res, next){
		if(!req.session.datasets)req.cloud.listDatasets(req.session.account, function (er, datasets) {
			if (er) return
			req.session.datasets = datasets;
			next();
		})
		else next()
	},
	packages:function (req, res, next){
		if (!req.session.packages)req.cloud.listPackages(req.session.account, function (er, packages) {
			if (er) return;
			req.session.packages = packages;
			next();
		})
		else next()
	},
	createView:function(req, res, next){
	  var dcNames = Object.keys(req.session.dc)
	  res.render("purchase.ejs",{ datacenters: dcNames,
					 datasets: req.session.datasets,
					 packages: req.session.packages });
	},
	create : function(req, res){
	  var dc=(req.body.machine.datacenter== ""?
			req.cloud:
			cloud(req.session.account.login, req.session.password, req.session.dc[req.body.machine.datacenter]))
	  dc.createMachine(req.session.account,req.body.machine,function (er, machine) {
		if (er) {
		  res.redirect('/purchase');
		}
		res.redirect('/machines')
	  })
	},
	machines:function(req, res,next){
		var dcNames = Object.keys(req.session.dc),
			newMachines =  {},
			todo = dcNames.length,
			done = 0;
		if(!req.query.p)req.query.p=1
		if(isNaN(req.query.p=req.query.p*1))req.query.p=1
		dcNames.forEach(function(name){
			var dc =cloud(req.session.account.login, req.session.password,req.session.dc[name]),
			opt={offset:(req.query.p-1)*limit,limit:limit}
			dc.listMachines(opt,function(er,machines){
				if(!er&&machines){
					for(var m in machines)
						machines[m].created=date(machines[m].created,1||0)
					newMachines[name]=machines
				}
				if(++done===todo){
					req.session.machines = newMachines
					next()
				}
			})
		})
	},
	machine:function(req, res,next){
		req.cloud.getMachine(req.session.account,req.params.id,false,function (er, machine, headers) {
			if (er && er.message.state === 'deleted') {
			
			} else if (er && er.httpCode === 404) {
			
			} else if (er ) {
			
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
	resizePost:function(req, res, next){
		if (!req.body) {

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
	reboot:function(req, res, next){
	  req.cloud.rebootMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		res.redirect('/'+req.params.dc+'/machine/'+req.params.id);
	  });
	},
	shutdown:function(req, res, next){
	  req.cloud.stopMachine(req.session.account,
							  req.params.id,
							  function (er) {
		var status = er ? er.httpCode || 500 : 200;
		res.redirect('/'+req.params.dc+'/machine/'+req.params.id);
	  });
	},
	startup:function(req, res, next){
	  req.cloud.startMachine(req.session.account,
							  req.params.id,
							  function (er){
		var status = er ? er.httpCode || 500 : 200;
		res.redirect('/'+req.params.dc+'/machine/'+req.params.id);
	  });
	},
	del:function(req, res, next){
	req.cloud.deleteMachine(req.session.account,
	req.params.id,
	function (er) {
		if (er) {
		  switch (er.httpCode){
			case 409:
			case 410:
			case 404:
			  er = null;
		  }
		}
		if (er) return //next(er);
		res.redirect('/machines');
	  })},
	refresh:function(req, res, next){res.redirect('/'+req.params.dc+'/machine/'+req.params.id)},
	snapshot:function(req, res, next){req.cloud.createMachineSnapshot(req.session.account,req.params.id,{a:'a'},function(){})},
	buy:function(req, res, next){
		if(req.params.type='machine')
			res.render('buymachine',{ datacenters: Object.keys(req.session.dc),
					 datasets: req.session.datasets,
					 packages: req.session.packages })
	}
}