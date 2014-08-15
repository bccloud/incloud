module.exports={appenders: [
	{type:'console'},//控制台
	{//date文件输出
		type:'dateFile',
		filename:'logs/',
		pattern:"yyyy-MM-dd-hh",
		alwaysIncludePattern: true,
		level:'info',
		category:"app"
	},
	{//文件输出
		type:'file',
		filename:'errs/err',  
		maxLogSize: 20480,  
		backups: 3,
		level:'info',
		category:"log"
	}
]}