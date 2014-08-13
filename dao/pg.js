module.exports=function(con,sql,next){
	require('pg').connect(con,function(err,pg,done) {
		if(err)return next(err)
		pg.query(sql, function(err, docs) {
			done()
			if(err)return next(err)
			if(docs.rowCount)return next(null,docs.rows[0]||true)
			next('无记录:'+sql+'\ndocs:'+(docs))
		})
	})
}