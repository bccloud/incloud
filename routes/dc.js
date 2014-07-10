var util = require('../util')
	,debug=util.debug
	,md5 = require('crypto').createHash('md5')//生成散列值来加密密码
	,config = require('../config')
	,CloudAPI = require('smartdc').CloudAPI
	,machine=require('./machine')
module.exports = {
	list : function(req, res) {
		if (!req.session.dc || Date.now() - req.session.dc.time > 60000 * 15) {
			req.cloud.listDatacenters(function(err, dcList) {
			  if (err) {
				console.log(err);
			  } else {
				req.session.dc = {
				  list: dcList,
				  time: Date.now()
				}
				machine.fetchList(req, res);
			  }
			});
		}else {
			machine.fetchList(req, res);
		}
	},
	getDatasetsAndPackages:function (req, res, next) {
	  var errState = null;
	  var n = 2;

	  if (req.session.datasets) then();
	  else req.cloud.listDatasets(req.session.account, function (er, d) {
		if (er) return
		req.session.datasets = d;
		then();
	  });

	  if (req.session.packages) then();
	  else req.cloud.listPackages(req.session.account, function (er, p) {
		if (er) return;
		req.session.packages = p;
		then();
	  });

	  function then () {
		if (-- n === 0) next();
	  }
	}
	



}