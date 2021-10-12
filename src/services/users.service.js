const logger = require('../common/logger')('UsersService');
const UsersRepository = require('../repositories/users.repository').instance();

class UsersService {
	static instance() {
		return userService;
	}

	async updateUser(res, dataToUpdate) {
		const updatedUser = await UsersRepository.updateUser(dataToUpdate);
		if (!updatedUser) {
			return res.status(500).send('Unknown error');
		}

		const publicUserData = {
			userId: updatedUser.userId,
			email: updatedUser.email,
			nickname: updatedUser.nickname,
			phone: updatedUser.phone,
			posts: updatedUser.posts
		};

		res.send(publicUserData);
	}

	async deleteUser(res, userId) {
		const user = await UsersRepository.getUser(null, userId);

		if (!user) {
			return res.status(404).send('User does not exist');
		}

		const deleteResult = await UsersRepository.deleteUser(userId);
		if (!deleteResult) {
			return res.status(500).send('Can not delete user');
		}

		const publicUserData = {
			userId: user.userId,
			email: user.email,
			nickname: user.nickname,
			phone: user.phone,
			posts: user.posts
		};

		res.send(publicUserData);
	}

	async getUser(res, userId) {
		const user = await UsersRepository.getUser(null, userId);

		if (!user) {
			return res.status(404).send('User does not exist');
		}

		const publicUserData = {
			userId: user.userId,
			email: user.email,
			nickname: user.nickname,
			phone: user.phone,
			posts: user.posts
		};

		res.send(publicUserData);
	}
}

const userService = new UsersService();

module.exports = UsersService;