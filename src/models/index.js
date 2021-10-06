'use strict';

const Sequelize = require('sequelize');

const config = require('../config');
const logger = require('../common/logger')('sequelize');

const db = {};

const dbConfig = config.db;

logger.info(`Connecting to the host - [ ${dbConfig.host} ], database - [ ${dbConfig.database} ]`);

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
	dialect: dbConfig.dialect,
	host: dbConfig.host,
	logging: (msg) => logger.trace(msg)
});

db.posts = require('./post.model')(sequelize, Sequelize);
db.users = require('./user.model')(sequelize, Sequelize);

db.users.hasMany(db.posts, { as: 'posts' });
db.posts.belongsTo(db.users, {
	foreignKey: 'userId',
	as: 'user'
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
