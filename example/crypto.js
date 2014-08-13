var crypto = require('crypto')
	,cipher=function(txt) {
		if(txt){
			var cipher = crypto.createCipher('aes-256-cbc','^VyDS43$CeCbhf4b3S(3X<56ut4bE$Gry&')
			var crypted = cipher.update(txt,'utf8','hex')
			return crypted += cipher.final('hex')
		}return ''
	},decipher=function(txt) {
		if(txt){
			var decipher = crypto.createDecipher('aes-256-cbc','^VyDS43$CeCbhf4b3S(3X<56ut4bE$Gry&')
			var dec = decipher.update(txt,'hex','utf8')
			return dec += decipher.final('utf8')
		}return ''
	},text = "朢"
console.log(text)
console.log(cipher(text))
console.log(decipher(cipher(text)))