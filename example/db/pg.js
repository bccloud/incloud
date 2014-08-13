require('pg').connect('postgres://incloud:root@localhost/incloudb',function(err,pg,done){
	err?console.error(err):pg.query('BEGIN', function(err) {
		var rollback = function(err){
			pg.query('ROLLBACK', function(){
				done()
				console.log(err)
			})
		}
		err?rollback(err):process.nextTick(function(){
			var sqls=["delete from users1",
					"insert into users1(id)values('123456')",
					"update users1 set login = '朢' WHERE id = '123456'",
					"select * from users1"],
			commits=function(sqls){
				var sql=sqls.shift()
				pg.query(sql, function(err, docs) {
					if(err)return rollback(err)
					if(docs.rowCount){
						sqls[0]?commits(sqls):pg.query('COMMIT', function(err) {
							if(err)return rollback(err)
							done()
							console.log('OK:',docs.rows[0])
						})
						console.log(docs.command)
					}else console.error('未果:',sql,'\ndocs:',docs)
				})
			}
			commits(sqls)
		})
	})
})