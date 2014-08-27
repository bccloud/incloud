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
	socket.on('chat',function(msg,callback){
		callback(msg)
		if(msg.to){
			if(online[msg.to])online[msg.to].emit('chat',msg,function(data){if(data='OK')callback(msg)});
			else socket.emit('chat',{message:'我现在不在，稍后回复'});
		}else {
			socket.broadcast.emit('chat',msg);
			callback(msg)
		}
	});
})}