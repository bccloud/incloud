var config = require('../../config')
	,capi = new (require('sdc-clients').CAPI)(config.capi)
	,util = require('../util')
	,logger=require('../../util').logger('account')
	,db = require('../../dao/db')
	
module.exports = {
}