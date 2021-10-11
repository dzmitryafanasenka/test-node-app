module.exports = (sequelize, Sequelize) => {
	return sequelize.define('users', {
		userId: {
			type: Sequelize.STRING,
			primaryKey: true,
			allowNull: false
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		nickname: {
			type: Sequelize.STRING,
			allowNull: true
		},
		phone: {
			type: Sequelize.STRING,
			allowNull: true
		},
		activationCode: {
			type: Sequelize.STRING,
			allowNull: false
		},
		activated: {
			type: Sequelize.BOOLEAN,
			allowNull: false
		}

	}, {
		timestamps: false
	});
};