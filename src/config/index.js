const database = require('./database');

const configuration = {
	db: database,
	logger: {
		debug: !!process.env.DEBUG
	},
	app: {
		host: process.env.APP_HOST || 'localhost',
		port: process.env.APP_PORT || 8080,
		client: {
			url: process.env.CLIENT_URL
		}
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