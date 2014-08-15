module.exports ={
	server:{
		//listenIp: "127.0.0.1",
		//port:81
	},
	session:{
		maxAge:1000 * 60 * 60 * 24 * 30,
		secret:'m7i98o',
		dburl:'://incloud:root@localhost/incloudb'
	}
}