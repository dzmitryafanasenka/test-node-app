'use strict';

const Sequelize = require('sequelize');

const logger = require('../common/logger')('sequelize');
const config = require('../config')

const dbConfig = config.db;
const db = {};

logger.info(`Connecting to the host - [ ${dbConfig.host} ], database - [ ${dbConfig.database} ]`)

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
	dialect: dbConfig.dialect,
	host: dbConfig.host,
	logging: (msg) => logger.trace(msg)
});

db.posts = require('./posts.model')(sequelize, Sequelize)
db.users = require('./users.model')(sequelize, Sequelize)
db.comments = require('./comments.model')(sequelize, Sequelize)

db.users.hasMany(db.posts, {as: 'posts'});
db.posts.belongsTo(db.users, {
	foreignKey: 'userId',
	as: 'user'
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;