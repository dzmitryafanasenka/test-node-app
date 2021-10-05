const { userImage } = require('../index');

async function addUser(data) {
	const result = await userImage.create({
		email: data.email,
		password: data.password,
		activationCode: data.activationCode,
		activated: data.activated
	});

	return result && result.dataValues;
}

async function activateUser(id) {
	const result = await userImage.update(
		{ activated: true },
		{ where: { id } }
	);

	return result;
}

async function deleteUser(id) {
	const result = await userImage.destroy({
		where: { id }
	});

	return result; 
}

async function getAllUsers() {
	const result = await userImage.findAll();

	return result;
}

async function getUser(email, id) {
	let result;
	if (email) {
		result = await userImage.findOne({ where: { email } });
	} else if (id) {
		result = await userImage.findOne({ where: { id } });
	}

	return result && result.dataValues;
}

module.exports = {
	addUser,
	activateUser,
	getAllUsers,
	getUser,
	deleteUser
};