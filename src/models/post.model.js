const Sequelize = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('posts', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		userId: {
			type: Sequelize.INTEGER,
			autoIncrement: false,
			allowNull: false,
			foreignKey: true
		},
		title: {
			type: Sequelize.STRING,
			allowNull: false
		},
		body: {
			type: Sequelize.STRING,
			allowNull: false
		},
		likes: {
			type: Sequelize.INTEGER,
			allowNull: true
		},
		dislikes: {
			type: Sequelize.INTEGER,
			allowNull: true
		}
	}, {
		timestamps: false
	});
};