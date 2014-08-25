module.exports ={
	server:{
		listenIp: '127.0.0.1',
		port:80,
		env:'production'
	},
	session:{
		maxAge:1000 * 60 * 60 * 24 * 30,
		secret:'qX85yj_dV_neNAUuIPoRDlCxa4MrLgD_',
		dburl:'://incloud:root@localhost/incloudb'
	}
}
