var socket = io.connect('http://localhost')
function $(str){return document.querySelector(str)}
function reValidity(obj){
	if(obj){
		obj.setCustomValidity("")
		socket.emit(obj.id,{account: obj.value},function(data){validity(data,obj)})
		socket.on('account',function(data){
		　　console.log(0000000000000000000)
		console.log(data.account)
		})
	}
}
function reboot(){
}