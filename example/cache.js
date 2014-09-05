var os = require('os');
var shop={user:'wangjh',goshop:[{期限:'1',购买容量:'10',数据中心:'BJ1'}]}
var redis = require("redis")
var client = redis.createClient()
client.on("error", function (err){
	console.log("Error " + err);
})
client.hmset(cache,shop,function (err, reply) {
        console.log(err||reply);
    });
//client.hset('cache', 'shop', 'a')
/*
cache.all=new Array()
cache.all.push(os)
cache.all1=new Array()
cache.all1.push(os)
cache.all2=new Array()
cache.all2.push(os)
cache.all3=new Array()
cache.all3.push(os)
cache.all4=new Array()
cache.all4.push(os)
cache.all5=new Array()
cache.all5.push(os)
cache.all6=new Array()
cache.all6.push(os)
cache.all7=new Array()
cache.all7.push(os)
cache.all8=new Array()
cache.all8.push(os)
cache.all9=new Array()
cache.all9.push(os)
		console.log(cache.all.length)
console.log(os.freemem()/os.totalmem())
		console.log(process.memoryUsage().heapUsed/process.memoryUsage().heapTotal)
console.log('--------------------------------------------------')
for(;cache.all[0];){
	if(
	os.freemem()/os.totalmem()<=0.15||
	process.memoryUsage().heapUsed/process.memoryUsage().heapTotal>=0.97
	){
		console.log(cache.all.length)
		console.log(os.freemem()/os.totalmem())
		console.log(process.memoryUsage().heapUsed/process.memoryUsage().heapTotal)
		console.log('end',os.freemem(),os.totalmem())
		 cache.all=new Array()
		 cache.all1=new Array()
		 cache.all2=new Array()
		 cache.all3=new Array()
		 cache.all4=new Array()
		 cache.all5=new Array()
		 cache.all6=new Array()
		 cache.all7=new Array()
		 cache.all8=new Array()
		 cache.all9=new Array()
	}else {
		cache.all.push(os)
		cache.all1.push(os)
		cache.all2.push(os)
		cache.all3.push(os)
		cache.all4.push(os)
		cache.all5.push(os)
		cache.all6.push(os)
		cache.all7.push(os)
		cache.all8.push(os)
		cache.all9.push(os)
		
	}
}

		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
		console.log(cache)
		console.log(os.freemem()/os.totalmem())
		console.log(process.memoryUsage().heapUsed/process.memoryUsage().heapTotal)
		console.log(os.freemem(),os.totalmem())
		console.log(cache.all)
for(;cache.all;){

		cache.all.push(os)
		cache.all1.push(os)
		cache.all2.push(os)
		cache.all3.push(os)
		cache.all4.push(os)
		cache.all5.push(os)
		cache.all6.push(os)
		cache.all7.push(os)
		cache.all8.push(os)
		cache.all9.push(os)
}var os = require('os');
console.log(cache)
console.log(process.memoryUsage().heapTotal)
console.log(process.memoryUsage().heapUsed)
console.log(os.hostname())
console.log(os.totalmem())
console.log(os.freemem())
console.log(os.type())
console.log(os.release())
cache.all=new Array()
cache.all.push(os)
cache.all1=new Array()
cache.all1.push(os)
cache.all2=new Array()
cache.all2.push(os)
cache.all3=new Array()
cache.all3.push(os)
cache.all4=new Array()
cache.all4.push(os)
cache.all5=new Array()
cache.all5.push(os)
cache.all6=new Array()
cache.all6.push(os)
cache.all7=new Array()
cache.all7.push(os)
cache.all8=new Array()
cache.all8.push(os)
cache.all9=new Array()
cache.all9.push(os)
		console.log(cache.all.length)
console.log(os.freemem()/os.totalmem())
		console.log(process.memoryUsage().heapUsed/process.memoryUsage().heapTotal)
console.log('--------------------------------------------------')
for(;cache.all[0];){
	if(
	os.freemem()/os.totalmem()<=0.15||
	process.memoryUsage().heapUsed/process.memoryUsage().heapTotal>=0.97
	){
		console.log(cache.all.length)
		console.log(os.freemem()/os.totalmem())
		console.log(process.memoryUsage().heapUsed/process.memoryUsage().heapTotal)
		console.log('end',os.freemem(),os.totalmem())
		 cache.all=new Array()
		 cache.all1=new Array()
		 cache.all2=new Array()
		 cache.all3=new Array()
		 cache.all4=new Array()
		 cache.all5=new Array()
		 cache.all6=new Array()
		 cache.all7=new Array()
		 cache.all8=new Array()
		 cache.all9=new Array()
	}else {
		cache.all.push(os)
		cache.all1.push(os)
		cache.all2.push(os)
		cache.all3.push(os)
		cache.all4.push(os)
		cache.all5.push(os)
		cache.all6.push(os)
		cache.all7.push(os)
		cache.all8.push(os)
		cache.all9.push(os)
		
	}
}

		console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
		console.log(cache)
		console.log(os.freemem()/os.totalmem())
		console.log(process.memoryUsage().heapUsed/process.memoryUsage().heapTotal)
		console.log(os.freemem(),os.totalmem())
		console.log(cache.all)
for(;cache.all;){

		cache.all.push(os)
		cache.all1.push(os)
		cache.all2.push(os)
		cache.all3.push(os)
		cache.all4.push(os)
		cache.all5.push(os)
		cache.all6.push(os)
		cache.all7.push(os)
		cache.all8.push(os)
		cache.all9.push(os)
}*/