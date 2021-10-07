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
			userId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'users',
					key: 'userId'
				}
			},
			postId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'posts',
					key: 'postId'
				}
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
