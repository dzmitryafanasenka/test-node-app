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
			throw new ServiceError(500, 'Unknown error');
		}

		return {
			userId: updatedUser.userId,
			email: updatedUser.email,
			nickname: updatedUser.nickname,
			phone: updatedUser.phone,
			posts: updatedUser.posts
		};
	}

	async deleteUser(userId) {
		const user = await UsersRepository.getUser(null, userId);

		if (!user) {
			throw new ServiceError(404, 'User does not exist');
		}

		const deleteResult = await UsersRepository.deleteUser(userId);
		if (!deleteResult) {
			throw new ServiceError(500, 'Can not delete user');
		}

		return {
			userId: user.userId,
			email: user.email,
			nickname: user.nickname,
			phone: user.phone,
			posts: user.posts
		};
	}

	async getFullUserInfo(userId) {
		const user = await UsersRepository.getUser(null, userId);

		if (!user) {
			throw new ServiceError(404, 'User does not exist');
		}

		return user;
	}

	async getUser(userId) {
		const user = await this.getFullUserInfo(userId);

		return {
			userId: user.userId,
			email: user.email,
			nickname: user.nickname,
			phone: user.phone,
			posts: user.posts
		};
	}

	async getAllUsers() {
		const allUsers = await UsersRepository.getAllUsers();

		const publicUsersData = allUsers.map((user) => {
			return {
				userId: user.userId,
				email: user.email,
				nickname: user.nickname,
				phone: user.phone,
				posts: user.posts
			};
		});

		if (!publicUsersData) {
			throw new ServiceError(404, 'Users not found');
		}

		return publicUsersData;
	}
}

const userService = new UsersService();

module.exports = UsersService;