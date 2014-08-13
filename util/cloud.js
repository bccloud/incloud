exports.cloud =function(user, pass, url) {
	var d = require('./config/cloudapi')
	d.username = user;
	d.password = pass;
	//d.url = url || cloudapi.url;
	d.logLevel ="warn";
	return new (require('smartdc').CloudAPI)(d);
}