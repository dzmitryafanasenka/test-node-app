module.exports = (sequelize, Sequelize) => {
	return sequelize.define('posts', {
		postId: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false
		},
		userId: {
			type: Sequelize.STRING,
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