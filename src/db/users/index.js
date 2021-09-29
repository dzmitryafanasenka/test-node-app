const { userImage } = require('../index');

async function addUser(data) {
	const result = await userImage.create({
		id: data.id,
		email: data.email,
		password: data.password,
		nickname: data.nickname
	});
}

module.exports = {
	addUser
};