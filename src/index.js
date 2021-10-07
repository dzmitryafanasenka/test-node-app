const express = require('express');
require('dotenv').config();

const config = require('./config')
const logger = require('./common/logger')('app');
const {sequelize} = require('./models/index');

const authController = require('./controllers/auth')
const postsController = require('./controllers/posts')
const usersController = require('./controllers/users')

const PORT = config.app.port || 8080;

class App {
	constructor() {
		this.express = new express();
		this.express.use(express.json());

		this.express.use('/users', usersController)
		this.express.use('/', authController);
		this.express.use('/posts', postsController)

		this.express.listen(PORT, () => {
			logger.info(`Server has successfully started on port ${PORT}`);
		});

		this.checkPgConnect();
	}

	async checkPgConnect() {
		try {
			await sequelize.authenticate();
			logger.info('Connection has been established successfully');
		} catch (error) {
			logger.error('Unable to connect to the database:', error);
		}
	}
}

module.exports = App;