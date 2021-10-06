const express = require('express');
require('dotenv').config();

const logger = require('./logger');
const { applyRoutes } = require('./routes/index');
const { sequelize } = require('./models/index');

const PORT = process.env.APP_PORT || 8080;

class App {
	constructor() {
		this.express = new express();
		this.express.use(express.json());

		applyRoutes(this.express);

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