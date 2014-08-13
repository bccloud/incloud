module.exports ={appenders: [
	{type:'console'},//控制台
	{
		type:'dateFile',
		filename:'logs/',
		pattern:"yyyy-MM-dd-hh",
		alwaysIncludePattern: true
	}//文件输出
]}