var log= require('log4js')
log.configure(require('../config/log'))
module.exports=log.getLogger('log');