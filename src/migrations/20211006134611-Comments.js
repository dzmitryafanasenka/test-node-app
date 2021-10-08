'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('comments', {
			commentId: {
				type: Sequelize.STRING,
				primaryKey: true,
				allowNull: false
			},
			userId: {
				type: Sequelize.STRING,
				references: {
					model: 'users',
					key: 'userId'
				}
			},
			postId: {
				type: Sequelize.STRING,
				references: {
					model: 'posts',
					key: 'postId'
				},
				onDelete: 'CASCADE'
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
