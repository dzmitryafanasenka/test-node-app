const Sequelize = require('sequelize');
require('dotenv').config();

const logger = require('../logger');
const userModel = require('./users/Model');

logger.info('Connecting to the database');
const { DB_NAME, DB_ADMIN, DB_HOST, DB_PASSWORD } = process.env;
const sequelize = new Sequelize(DB_NAME, DB_ADMIN, DB_PASSWORD, {
	dialect: 'postgres',
	host: DB_HOST,
	logging: (msg) => logger.mark(msg)
});
const userImage = userModel(sequelize);

module.exports = {
	 sequelize,
	userImage
};