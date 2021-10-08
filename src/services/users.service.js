const db = require('../models');
const logger = require('../common/logger')('UsersService');

class UsersService {
	constructor() {
		this._users = db.users;
	}

	static instance() {
		return userService;
	}

	async addUser(data) {
		const result = await this._users.create({
			email: data.email,
			password: data.password,
			activationCode: data.activationCode,
			activated: data.activated
		});

		return result && result.dataValues;
	}

	async activateUser(id) {
		const result = await this._users.update(
			{ activated: true },
			{ where: { id } }
		);

		return result;
	}

	async deleteUser(userId) {
		const result = await this._users.destroy({
			where: { userId }
		});

		return result;
	}

	async getAllUsers() {
		const result = await this._users.findAll({
			include: [{
				model: db.posts
			}]
		});

		return result;
	}

	async getUser(email, userId) {
		let result;
		if (email) {
			result = await this._users.findOne({ where: { email } });
		} else if (userId) {
			result = await this._users.findOne({ where: { userId } });
		}

		return result && result.dataValues;
	}
}

const userService = new UsersService();

module.exports = UsersService;