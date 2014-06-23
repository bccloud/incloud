process.env.node_env='production'//设置当前环境为生产环境，避免在浏览器输出异常，默认为development
var express = require('express.io')//require-引入功能模块(即框架：jquery、Spring)。express.io-nodejs的Web开发框架(express+socket.io)相当于java的ssh
	,app = express().http().io()
	,config = require('./config')
	,port=process.env.PORT || config.server.port//process.env访问环境变量
	,IP=config.server.listenIp || "127.0.0.1"
	,local = require('./local')
	,logger=require('./util').logger('index')

//set设置属性get获取属性
app.set('views', __dirname+'/views')//设置自动获取视图的目录（存放html/ejs）
app.set('view engine', 'ejs')//启用模板引擎ejs,ejs功能相当于JSP
//<% code %>：ejs nodejs脚本  
//<%= code %>：ejs输出
//<%- code %>：ejs指令
//<%- function%>:调用res.locals中的方法
app.use(express.favicon(__dirname+'/public/images/favicon.ico'));//浏览器标签页小图标
app.use(require('log4js').connectLogger(logger, {level:'auto'}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser())//cookie支持
app.use(express.session({//session支持
	key:config.session.key // cookie 的名字
	,secret: config.session.secret//防止篡改 cookie
	,cookie: {maxAge: config.session.maxAge}//30 days,cookie的生存期
}))

app.use(require('stylus').middleware(__dirname+'/public'));//启用CSS预处理器 Stylus，stylus必须在stylesheets文件夹中
app.use(express.static(__dirname+'/public'));//自动获取静态文件目录

require('./routes')(app);//调用自定义模块（路由映射，处理各种请求），并将app作为参数

app.listen(port,IP,function(){
	logger.info('server start...');
})//开启服务监听端口，成功后回调输出监听IP和端口