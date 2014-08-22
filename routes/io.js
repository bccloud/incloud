module.exports=function(io){
var online={},users={}
io.on('connection', function(socket){
	var account=''
	if(socket.handshake&&socket.handshake.session&&(account=socket.handshake.session.account)){
		account=account.login
        online[account]=socket
        users[account]=1
        io.sockets.emit('online', users)		
		socket.on('disconnect',function(){
			delete online[account];
			users[account]=0
			io.sockets.emit('online', users)
		})	
    }
})
}