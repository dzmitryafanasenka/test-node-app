module.exports = (sequelize, Sequelize) => {
	return sequelize.define('comments', {
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
};