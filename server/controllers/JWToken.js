let jwt = require('jsonwebtoken');
const secretKey = 'DAYADHCOSMIC!@#)(87^%)';

let issueToken=(args,exp = null,callback)=>
{
	var issuedAt = Math.floor(Date.now() / 1000);
	var notBefore=issuedAt+10;
	var expire= notBefore+(24*60*60);
	data = {
			iat  : issuedAt,         // Issued at: time when the token was generated
			nbf  : notBefore,        // Not before
			exp  : expire,           // Expire
			data : args
		};
token = jwt.sign(data, secretKey);
callback(null,token);
}
module.exports = {
	issueToken
}