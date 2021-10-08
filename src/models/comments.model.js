module.exports = (sequelize, Sequelize) => {
	return sequelize.define('comments', {
		commentId: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false
		},
		userId: {
			type: Sequelize.STRING,
			foreignKey: true
		},
		postId: {
			type: Sequelize.STRING,
			foreignKey: true
		},
		body: {
			type: Sequelize.STRING,
			allowNull: false
		}
	}, {
		timestamps: false
	});
};