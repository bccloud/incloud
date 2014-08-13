module.exports = {
	capi: {
		"url": "http://192.168.113.203:8080",
		"username": "admin",
		"password": "tot@ls3crit"
	},
	mail : {
		host : "smtp.qq.com",
		port:465,
		user:'1507632849@qq.com',
		pass:'miraclet0'
	},
	dburl:'://incloud:root@localhost/incloudb',
	externalUrl : "https://localhost:80",
	passResetMail:__dirname+'/PASSWORD_RESET_EMAIL.html',
	//'machineQueryLimit':200,
	logLevel:'warn',
	log4js:{appenders: [
		{type:'console'},//控制台
		{
			type:'dateFile',
			filename:'logs/',
			pattern:"yyyy-MM-dd-hh",
			alwaysIncludePattern: true
		}//文件输出
	]}
};
