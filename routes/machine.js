var cloud=require('../util/cloud')
	,limit=require('../config/limit')
	,date=require('../util/date')
	,db = require('../dao/mongo')
module.exports = {
	dcs:function(req, res,next){
		//if(!req.session.dc)
			db.find('dcs',{},function(err,doc){
				if(doc[0]){
					req.session.dc =doc[0]
					//console.log('=========dc============',req.session.dc)
					next()
				}else
				req.cloud.listDatacenters(function(err, dc) {
					if (err){
					//console.log('=========dc2============',req.session.dc)
					}else{
					db.insert('dcs',dc,function(err,doc){})
					req.session.dc =dc
					//console.log('=========dc2============',req.session.dc)
					next()
					}
				})
			})
		//else next()
	},
	datasets:function (req, res, next){
		//if(!req.session.datasets)
			db.find('datasets',{},function(err,doc){
				if(doc[0]){
					req.session.datasets =doc
					//console.log('=========datasets============',req.session.datasets)
					next()
				}else
				req.cloud.listDatasets(req.session.account, function (er, datasets) {
					if (err){
					//console.log('=========datasets2============',req.session.datasets)
					}else{
					db.insert('datasets',datasets,function(err,doc){})
					req.session.datasets = datasets;
					//console.log('=========datasets2============',req.session.datasets)
					next()
					}
				})
			})
		//else next()
	},
	packages:function (req, res, next){
		//if (!req.session.packages)
			db.find('packages',{},function(err,doc){
				if(doc[0]){
					req.session.packages =doc
					//console.log('=========packages============',req.session.packages)
					next()
				}else
				req.cloud.listPackages(req.session.account, function (er, packages) {
					if (er){
					//console.log('=========packages2============',req.session.packages);
					}else{
					db.insert('packages',packages,function(err,doc){})
					req.session.packages = packages;
					//console.log('=========packages2============',req.session.packages)
					next();
					}
				})
			})
		//else next()
	},
	createView:function(req, res, next){
	
	
		db.find('goshop',{user:req.session.account.login},function(err,doc){
			if(err)res.send('err')
			else{// if(doc){
				req.session.goshop=doc
				var dcNames = Object.keys(req.session.dc)
				res.render("purchase.ejs",{goshop:req.session.goshop,
								datacenters: dcNames,
								 datasets: req.session.datasets,
								 packages: req.session.packages });
			}//else res.send('无记录')
		})
	
	
	},
	create : function(req, res){
		//var dc=(req.body.machine.datacenter== ""?
		//	req.cloud:
		//	cloud(req.session.account.login, req.session.password, req.session.dc[req.body.machine.datacenter]))
		var dc=	req.cloud
		db.find('goshop',{user:req.session.account.login},function(err,doc){
			if(err)res.send(err.message)
			else{// if(doc){
				/*for(var keys in doc){
				console.log(req.session.account)
				console.log(doc[keys].goshop)
				  dc.createMachine(req.session.account,doc[keys].goshop,function (er, machine) {
					if (er) {
					  res.redirect('/purchase');
					}
					res.redirect('/machines')
				  })
				}*/
				var i=0;
				(function createMachine(goshops){
						machine={
							name:'test'+i,
							datacenter: goshops.goshop.datacenters,
							dataset: goshops.goshop.datasets,
							package: goshops.goshop.package
						};
				console.log("createMachine=========================")
						dc.createMachine(req.session.account,machine,function (er, machine) {
							if (er) {
							 res.send('/purchase');
							}
							//res.redirect('/machines')
							++i
							if(doc[i]){
								createMachine(doc[i])
							}else{
								db.del('goshop',{user:req.session.account.login},function(err,doc){
									if(err)res.send(err.message)
									else{// if(doc){
										req.session.goshop={}
									}//else res.send('无记录')
								})
								res.send('/machines')
							}
						})
				})(doc[0]);
			}//else res.send('无记录')
		})
	},
	machines:function(req, res,next){
		delete req.session.dc._id
		var dcNames = Object.keys(req.session.dc),
			newMachines =  {},
			todo = dcNames.length,
			done = 0;
		if(!req.query.p)req.query.p=1
		if(isNaN(req.query.p=req.query.p*1)||(req.query.p<1))req.query.p=1
		dcNames.forEach(function(name){
		if(name!='_id'){
			var dc =cloud(req.session.account.login, req.session.password,req.session.dc[name]),
			opt={offset:((req.query.p-1)*limit),limit:(req.query.p==1?limit:limit+1)}
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
		}})
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
		if (er) throw er//return //next(er);
		res.redirect('/machines');
	})},
	refresh:function(req, res, next){res.redirect('/'+req.params.dc+'/machine/'+req.params.id)},
	snapshot:function(req, res, next){req.cloud.createMachineSnapshot(req.session.account,req.params.id,{a:'a'},function(){})},
	type:function(req, res, next){
			res.render('buy/'+req.params.type,{ datacenters: Object.keys(req.session.dc),
					 datasets: req.session.datasets,
					 packages: req.session.packages })
	},
	goshop:function(req, res, next){
		for(var keys in req.params){
			req.body[keys]=req.params[keys]
		}/*
		db.upsert('goshop',{where:{user:req.session.account.login},push:{goshop:req.body}},function(err,doc){
			if(err)res.send('err')
			else{// if(doc){
				req.session.goshop.push(req.body)
				console.log(req.session.goshop)
				res.send(req.session.goshop)
			}//else res.send('无记录')
		})*/
		db.insert('goshop',{user:req.session.account.login,goshop:req.body},function(err,doc){
			if(err)res.send('err')
			else{// if(doc){
				res.send('OK')
			}//else res.send('无记录')
		})
	},
	getgoshop:function(req, res){
		db.find('goshop',{user:req.session.account.login},function(err,doc){
			if(err)res.send('err')
			else{// if(doc){
				req.session.goshop=doc
				console.log(req.session.goshop)
				res.send(req.session.goshop)
			}//else res.send('无记录')
		})
	},
	clear:function clear(req, res){
		db.del('goshop',{user:req.session.account.login},function(err,doc){
			if(err)res.send('err')
			else{// if(doc){
				req.session.goshop={}
				console.log(req.session.goshop)
				res.send(req.session.goshop)
			}//else res.send('无记录')
		})
	}
}