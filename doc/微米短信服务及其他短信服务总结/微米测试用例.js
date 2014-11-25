var http = require('http');
var querystring = require('querystring');
var postData = {
    type:'json',
    uid:'QGDObUYoAfTh',
    pas:'cej4t7m7',    //mob:'15010761907,15507588164,18813189347,15169630761,18766239205,15210804354,13406306224,13210177393,15166191060,15064048913,15510127110,15811503070,13573106170,15854101505,13325256170',
	mob:'15811503070',
    cid:'Ao46WccWyK18',
	p1:parseInt((Math.random()*9+1)*100000)+'µÇÂ¼www.canfeit.comÊ¹ÓÃ¡£'
};
var content = querystring.stringify(postData);
var options = {
    host:'api.weimi.cc',
    path:'/2/sms/send.html',
    method:'POST',
    agent:false,
    rejectUnauthorized : false,
    headers:{
        'Content-Type' : 'application/x-www-form-urlencoded', 
        'Content-Length' :content.length
    }
};
var req = http.request(options,function(res){
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log(JSON.parse(chunk));
    });
    res.on('end',function(){
        console.log('over');
    });
});
req.write(content);
req.end();