var log= require('log4js')
log.configure({"appenders": [{"type":"console"}]})
module.exports=log.getLogger('app');