const logger = require('../common/logger')('UsersService');
const ServiceError = require('../common/errors/ServiceError');
const UsersRepository = require('../repositories/users.repository').instance();

class UsersService {
	static instance() {
		return userService;
	}

	async updateUser(dataToUpdate) {
		const updatedUser = await UsersRepository.updateUser(dataToUpdate);
		if (!updatedUser) {
			return new ServiceError(500, 'Unknown error');
		}

		const publicUserData = {
			userId: updatedUser.userId,
			email: updatedUser.email,
			nickname: updatedUser.nickname,
			phone: updatedUser.phone,
			posts: updatedUser.posts
		};

		return publicUserData;
	}

	async deleteUser(userId) {
		const user = await UsersRepository.getUser(null, userId);

		if (!user) {
			return new ServiceError(404, 'User does not exist');
		}

		const deleteResult = await UsersRepository.deleteUser(userId);
		if (!deleteResult) {
			return new ServiceError(500, 'Can not delete user');
		}

		const publicUserData = {
			userId: user.userId,
			email: user.email,
			nickname: user.nickname,
			phone: user.phone,
			posts: user.posts
		};

		return publicUserData;
	}

	async getUser(userId) {
		const user = await UsersRepository.getUser(null, userId);

		if (!user) {
			return new ServiceError(404, 'User does not exist');
		}

		const publicUserData = {
			userId: user.userId,
			email: user.email,
			nickname: user.nickname,
			phone: user.phone,
			posts: user.posts
		};

		return publicUserData;
	}
}

const userService = new UsersService();

module.exports = UsersService;