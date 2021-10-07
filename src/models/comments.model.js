module.exports = (sequelize, Sequelize) => {
	return sequelize.define('comments', {
		commentId: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
			allowNull: false
		},
		userId: {
			type: Sequelize.INTEGER,
			foreignKey: true
		},
		postId: {
			type: Sequelize.INTEGER,
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