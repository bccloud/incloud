exports.logger=function(name){
		var log4js = require('log4js')
		log4js.configure(require('./config/log4'))
		return log4js.getLogger(name);
}