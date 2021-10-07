'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('posts', {
			postId: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false
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
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.dropTable('posts');
	}
};
