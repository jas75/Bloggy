const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports=
{
	uri: 'mongodb://localhost:27017/Bloggy',// Dev
	// uri: 'mongodb://jas75:babar23@ds153853.mlab.com:53853/bloggy', // Production
	secret: crypto,//
	db: 'Bloggy'
}