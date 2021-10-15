const express = require('express');
const joi = require('joi');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
require('dotenv').config();

const config = require('./config');
const configValidator = require('./config/config.validation');
const logger = require('./common/logger')('app');
const swaggerDocument = YAML.load('./public/swagger.yaml');
const { sequelize } = require('./models/index');


const authController = require('./controllers/auth');
const commentsController = require('./controllers/comments');
const postsController = require('./controllers/posts');
const usersController = require('./controllers/users');

const PORT = config.app.port || 8080;

class App {
	constructor() {
		this.checkServerConfig();

		this.express = new express();
		this.express.use(express.json());
		this.express.use(
			'/api-docs',
			swaggerUi.serve,
			swaggerUi.setup(swaggerDocument)
		);

		this.express.use('/users', usersController);
		this.express.use('/', authController);
		this.express.use('/posts', postsController);
		this.express.use('/posts', commentsController);

		this.express.use((req, res, next) => {
			res.status(404).send('Not found')
		})

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

			return process.exit()
		}
	}

	checkServerConfig() {
		try {
			joi.assert(config, configValidator);
		} catch (validationError) {
			logger.error('Configuration is not valid', validationError);

			return process.exit();
		}
	}
}

module.exports = App;