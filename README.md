##incloud
=======
##版本：0.0.1
##部署：
	nodejs版本：0.9.0,
	"customPortal": {
		"uri": "https://192.168.113.205/",
		"username": "wangjh",
		"password": "wjh_bcc"
	},
	"cloudApi": {
		"url": "https://192.168.113.204",
		"version": ">=6.5.0"
	},
	"capi": {
		"uri": "http://192.168.113.203:8080",
		"username": "admin",
		"password": "tot@ls3crit"
	},
##will:
根据resize记录，做后付费，预付费
完成环境部署，业务逻辑层处理基本完成
开始view视图层的开发
##逻辑测试
##完成环境部署，业务逻辑层处理基本完成
开始view视图层的开发
1、	压力测试<br>
•对mongo、MySQL、PG进行压力测试比较<br>
•测试java、nodejs、node cluster性能<br>
•测试并优化数据库操作处理逻辑<br>
2、	架构调整<br>
•Express3升级为express4，利用express4的Router功能优化映射处理逻辑，简化代码提高性能和安全性<br>
•比较websocket、XMLHttpRequest2、submit数据传输方式，用XMLHttpRequest2代替webSocket进行数据传输，解决cookie共享的问题<br>
•用mongo代替connect进行session存储，session存储位置由内存改为硬盘，降低内存占用，服务重启session不丢失。<br>
3、	对数据库数据进行cipher加密存储<br>
4、	优化数据库更新无记录时的处理逻辑<br>
5、	解决服务启动之初session为空，无法登录的问题<br>
6、	解决服务重启后，已经打开的页面偶尔无法与服务端交互的问题<br>
7、	研究JSE原理，利用JAVASCRIPT函数escape()和unescape()编码实现对JS文件进行加密、解密的功能<br>
8、	学习mongoDB，pg数据库使用<br>
9、	完善异常捕获方式，捕获未知异常<br>
10、	改进log输出，将info信息和err信息分别输出，方便err信息查阅，info信息采用dateFile形式存储<br>
11、	解决使用IP无法登录问题<br>