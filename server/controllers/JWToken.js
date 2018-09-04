let jwt = require('jsonwebtoken');
// const issuingDomain = 'cosmiclabs.co';
const secretKey = 'DAYADHCOSMIC!@#)(87^%)';

module.exports.issueToken=(args,exp = null,callback)=>
{
	var date = new Date();
	var issuedAt = Math.floor(Date.now() / 1000);
	// var serverName =issuingDomain;
	var notBefore=issuedAt+10;
	var expire= notBefore+(24*60*60);


	// serverName =issuingDomain; 
	data = {
			iat  : issuedAt,         // Issued at: time when the token was generated
			// iss  : serverName,       // Issuer
			nbf  : notBefore,        // Not before
			exp  : expire,           // Expire
			data : args
		};

token = jwt.sign(data, secretKey);
callback(null,token);
/*//console.log(token);
	if(token)
		{
		var ip= app.get('/',(req,res)=>res.dh.getIP());		
		console.log(ip);		
		}*/
}