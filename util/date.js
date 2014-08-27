module.exports=function(date,Z){
	var ServerZone=require('../config/zone')
	date=new Date(date)
	date=date.getTime()+(3600000*(Z-ServerZone))
	date=new Date(date)
	var M=date.getMonth()+1,D=date.getDate()
	if(Z>=0&&Z<10)Z='+0'+Z
	else if(Z>-10&&Z<0)Z='-0'+(Z*-1)
	else if(Z>0)Z='+'+Z
	date=date.getFullYear()+
		'-'+(M<10?('0'+M):M)+
		'-'+(D<10?('0'+D):D)+
		'T'+date.toLocaleTimeString()+
		//' GTM'+
		Z+':00'
	return date
}