var log=require('./util/log'),domain = require('domain').create(),cluster=require('cluster')
domain.on('error', function(e) {log.error("error in domain:", e)})//捕获异常
domain.run(function () {
try{
if(cluster.isMaster){//提供多核集群
	require('os').cpus().forEach(function(){cluster.fork()})
	cluster.on('exit', function(worker, code, signal) {
	  log.error('worker %d died (%s). restarting...',worker.process.pid, signal || code);
	  cluster.fork();//新建进程
	})
}else{var storeMemory=new(require('connect-mongo')(require('express-session')))({url:'mongodb'+require('./config').session.dburl}),
	cookieParser=require('cookie-parser'),
	secret=require('./config').session.secret,
	app = require('express')()//require-引入功能模块(即框架：jquery、Spring)
	//.set('env',require('./config').server.env)//设置当前环境为生产环境，避免在浏览器输出异常，默认为development
	.set('views', __dirname+'/views')//设置自动获取视图的目录（存放ejs）//set设置属性get获取属性
	.set('view engine', 'ejs')//启用模板引擎ejs,ejs功能相当于JSP//<% code %>：ejs nodejs脚本//<%= code %>：ejs输出//<%- code %>：ejs指令//<%- function%>:调用res.locals中的方法
	.use(require('serve-favicon')(__dirname+'/public/images/favicon.ico'))//浏览器标签页小图标//use设置功能
	.use(require('log4js').connectLogger(require('./util/applog')))//相当于log4j
	.use(require('body-parser').urlencoded({extended: true}))//传递请求数据req.body
	.use(require('body-parser').json())//支持json数据传递
	.use(require('method-override')())//扩展put、del请求
	.use(cookieParser())//cookie支持
	.use(require('express-session')({//session支持
		store:storeMemory,//session存储于mongo
		secret:secret//防止篡改 cookie
		,cookie: {secure:true,maxAge: require('./config').session.maxAge}//30 days,cookie的生存期
		,resave:true//强制保存，即使未修改
		,saveUninitialized:true//session初始化之前保存
	}))
	.use(require('stylus').middleware(__dirname+'/public'))//启用CSS预处理器 Stylus，stylus必须在stylesheets文件夹中
	.use(require('express').static(__dirname+'/public'))//自动获取静态文件目录
	//.use([/path], function)为指定path（默认为所有,可为正则表达式）启用指定function
	.use(require('./util/local'))
	.use(require('./routes'))//自定义路由解析
	.use(require('./util/errs')._404)
	.use(require('./util/errs').err)	
	var server=require('https').createServer({key: require("fs").readFileSync('./key/privatekey.pem'),cert: require("fs").readFileSync('./key/certificate.pem')}, app)//建立https服务
	.listen(require('./config').server.port||80,require('./config').server.listenIp||'localhost',function(){log.info(app.get('env')+',server pid:', process.pid )}),//开启服务监听端口
	io=require('socket.io').listen(server);//SocketIO实时通讯框架，见百度百科 SocketIO
	require('http').createServer(app).listen(81)
	
//以下为自己开发的Session功能
io.set('authorization', function(data, callback){
    data.cookie = cookieParser.signedCookies(require('cookie').parse(data.headers.cookie),secret)
	storeMemory.get(data.cookie['connect.sid'], function(error, session){
		if(error)return callback(error.message, false)
		if(!session)return callback('nosession')
	console.log(2222222222222222,session)
		data.session = session;
		callback(null, true)
	})
})
 
io.on('connection', function (socket) {
	console.log(1111111111,socket.handshake.session)
})	
}
}catch(e){log.error('try',e)}
})
process.on('uncaughtException',function (e) {//处理未捕获异常
	log.error('uncaughtException',e)
})
