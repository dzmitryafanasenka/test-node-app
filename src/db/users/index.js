const { userImage } = require('../index');

async function addUser(data) {
	const result = await userImage.create({
		email: data.email,
		password: data.password
	});

	return result && result.dataValues;
}

async function deleteUser() {

}

async function getAllUsers() {
	const result = await userImage.findAll();

	return result && result.dataValues;
}

async function getUser(email) {
	const result = await userImage.findOne({ where: { email } });

	return result && result.dataValues;
}

module.exports = {
	addUser,
	getAllUsers,
	getUser
};