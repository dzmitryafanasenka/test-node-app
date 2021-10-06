'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const postModel = require('./posts/Model');
const userModel = require('./users/Model');
const logger = require('../logger')

const basename = path.basename(__filename);
const db = {};

const {DB_NAME, DB_ADMIN, DB_HOST, DB_PASSWORD} = process.env;
const sequelize = new Sequelize(DB_NAME, DB_ADMIN, DB_PASSWORD, {
	dialect: 'postgres',
	host: DB_HOST,
	logging: (msg) => logger.mark(msg)
});

fs
	.readdirSync(__dirname)
	.filter((file) => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

const userImage = userModel(sequelize)
const postImage = userModel(sequelize)

module.exports = {
	sequelize,
	userImage,
	postImage
};
