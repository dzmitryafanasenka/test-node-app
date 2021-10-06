const database = require('./database');

const configuration = {
	db: database,
	logger: {
		debug: !!process.env.DEBUG
	},
	app: {
		port: process.env.APP_PORT || 8080,
		host: process.env.APP_HOST || 'localhost'
	},
	mail: {
		username: process.env.EMAIL_USER,
		password: process.env.EMAIL_PASSWORD
	},
	jwt: {
		secret: process.env.ACCESS_TOKEN_SECRET,
		exp: process.env.TOKEN_EXPIRE_TIME
	}
};

module.exports = configuration;
