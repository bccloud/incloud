var log=require('./util/log'),domain = require('domain').create(),cluster=require('cluster')
try{
domain.on('error', function(e) {log.error("error in domain:", e)})//捕获异常
domain.run(function () {
if(cluster.isMaster){//提供多核集群
	require('os').cpus().forEach(function(){cluster.fork()})
	cluster.on('exit', function(worker, code, signal) {
	  log.error('worker %d died (%s). restarting...',worker.process.pid, signal || code);
	  cluster.fork();//新建进程
	})
}else{process.env.node_env='production'//设置当前环境为生产环境，避免在浏览器输出异常，默认为development
	var app = require('express')()//require-引入功能模块(即框架：jquery、Spring)
	app.set('views', __dirname+'/views')//设置自动获取视图的目录（存放ejs）//set设置属性get获取属性
	app.set('view engine', 'ejs')//启用模板引擎ejs,ejs功能相当于JSP//<% code %>：ejs nodejs脚本//<%= code %>：ejs输出//<%- code %>：ejs指令//<%- function%>:调用res.locals中的方法
	app.use(require('serve-favicon')(__dirname+'/public/images/favicon.ico'));//浏览器标签页小图标//use设置功能
	app.use(require('log4js').connectLogger(require('./util/applog')));//相当于log4j
	app.use(require('body-parser').urlencoded({extended: true}));//传递请求数据req.body
	app.use(require('body-parser').json());//支持json数据传递
	app.use(require('method-override')());//扩展put、del请求
	app.use(require('cookie-parser')(require('./config').session.secret))//cookie支持
	app.use(require('express-session')({//session支持
		store:new(require('connect-mongo')(require('express-session')))({url:'mongodb'+require('./config').session.dburl}),//session存储于mongo
		secret: require('./config').session.secret//防止篡改 cookie
		,cookie: {secure:true,maxAge: require('./config').session.maxAge}//30 days,cookie的生存期
		,resave:true//强制保存，即使未修改
		,saveUninitialized:true//session初始化之前保存
	}))
	app.use(require('stylus').middleware(__dirname+'/public'));//启用CSS预处理器 Stylus，stylus必须在stylesheets文件夹中
	app.use(require('express').static(__dirname+'/public'));//自动获取静态文件目录
	app.use(require('./routes'));//自定义路由解析
	require('https').createServer({key: require("fs").readFileSync('./key/privatekey.pem'),cert: require("fs").readFileSync('./key/certificate.pem')}, app)//建立https服务
	.listen(require('./config').server.port||80,require('./config').server.listenIp||'localhost',function(){log.info('server pid:', process.pid )})//开启服务监听端口	
}})
process.on('uncaughtException',function (e) {//处理未捕获异常
	log.error('uncaughtException',e)
})
}catch(e){log.error('try',e)}