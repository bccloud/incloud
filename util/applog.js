var log= require('log4js')
log.configure('config/log.json')
module.exports=log.getLogger('app');