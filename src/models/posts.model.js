module.exports = (sequelize, Sequelize) => {
	return sequelize.define('posts', {
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: false,
			allowNull: false
		},
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
};