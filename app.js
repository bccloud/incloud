global.locals=require('./config/lan')
var sessionStore=new(require('connect-mongo')(require('express-session')))({url:'mongodb'+require('./config/dburl')}),
	secret=require('./config').session.secret,
	app = require('express')()//require-引入功能模块(即框架：jquery、Spring)
	.set('env',require('./config').server.env)//设置当前环境为生产环境，避免在浏览器输出异常，默认为development
	.set('views', __dirname+'/views')//设置自动获取视图的目录（存放ejs）//set设置属性get获取属性
	.set('view engine', 'ejs')//启用模板引擎ejs,ejs功能相当于JSP//<% code %>：ejs nodejs脚本//<%= code %>：ejs输出//<%- code %>：ejs指令//<%- function%>:调用res.locals中的方法
	.use(require('serve-favicon')(__dirname+'/public/images/favicon.ico'))//浏览器标签页小图标//use设置功能
	.use(require('log4js').connectLogger(require('./config/log')))//相当于log4j
	.use(require('body-parser').urlencoded({extended: true}))//传递请求数据req.body
	.use(require('body-parser').json())//支持json数据传递
	.use(require('method-override')())//扩展put、del请求
	.use(require('cookie-parser')())//cookie支持
	.use(require('express-session')({//session支持
		store:sessionStore,//session存储于mongo
		secret:secret//防止篡改 cookie
		,cookie: {secure:true,maxAge: require('./config').session.maxAge}//30 days,cookie的生存期
		,resave:true//强制保存，即使未修改
		,saveUninitialized:true//session初始化之前保存
	}))
	.use(require('express').static(__dirname+'/public'))//自动获取静态文件目录	
	.use(require('./util/local'))//.use([/path], function)为指定path（默认为所有,可为正则表达式）启用指定function
	.use(require('./routes'))//自定义路由解析
	.use(require('./util/errs')._404)
	.use(require('./util/errs').err),
	server=require('https').createServer({key: require("fs").readFileSync('./key/privatekey.pem'),cert: require("fs").readFileSync('./key/certificate.pem')}, app)
	.listen(require('./config').server.port||80,require('./config').server.listenIp||'localhost',function(){console.error(app.get('env'),server._connectionKey,'pid:', process.pid)}),//建立https服务
	io=require('socket.io').listen(server)//SocketIO实时通讯框架
	
	//以下为自主开发的Session功能
io.set('authorization', function(data, callback){
	sessionStore.get(secret, function(error, session){
		if(error)return callback(error.message, false)
		if(!session)return callback('nosession')
		data.session=session
		callback(null, true)
	})
})
require('./routes/io')(io)