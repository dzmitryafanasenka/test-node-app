'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('comments', {
			commentId: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false
			},
			id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			postId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			body: {
				type: Sequelize.STRING,
				allowNull: false
			}
		}, {
			timestamps: false
		});
	},

	down: async (queryInterface, Sequelize) => {
		return queryInterface.dropTable('comments');
	}
};
