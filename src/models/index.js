'use strict';

const Sequelize = require('sequelize');

const config = require('../config');
const logger = require('../common/logger')('sequelize');

const dbConfig = config.db;
const db = {};

logger.info(`Connecting to the host - [ ${dbConfig.host} ], database - [ ${dbConfig.database} ]`);

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
	dialect: dbConfig.dialect,
	host: dbConfig.host,
	logging: (msg) => logger.trace(msg)
});

db.users = require('./users.model')(sequelize, Sequelize);
db.posts = require('./posts.model')(sequelize, Sequelize);
db.comments = require('./comments.model')(sequelize, Sequelize);

db.users.hasMany(db.posts, { foreignKey: 'userId' });
db.posts.belongsTo(db.users, { foreignKey: 'userId', as: 'user' });

db.posts.hasMany(db.comments, { foreignKey: 'postId' });
db.comments.belongsTo(db.comments, { foreignKey: 'postId', as: 'post' });

db.comments.belongsTo(db.users, { foreignKey: 'userId', as: 'user' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;