module.exports = {
	"server":{
		"listenIp": "127.0.0.1",
		"port":3000
	},
	"customPortal": {
		"url": "https://192.168.113.205/",
		"username": "wangjh",
		"password": "wjh_bcc"
	},
	"cloudApi": {
		"url": "https://192.168.113.204",
		"version": ">=6.5.0"
	},
	"capi": {
		"url": "http://192.168.113.203:8080",
		"username": "admin",
		"password": "tot@ls3crit"
	},
	"session":{
		"maxAge":1000 * 60 * 60 * 24 * 30,
		"key":'incloud',
		"secret":'m7i98o'
	},
	'machineQueryLimit':200,
	'logLevel':'warn'
};
