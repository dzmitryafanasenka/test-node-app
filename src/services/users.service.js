const db = require('../models')
const logger = require('../common/logger')('UsersService')

class UsersService {
	constructor() {
		this._users = db.users;
	}

	static instance() {
		return userService
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
			{activated: true},
			{where: {id}}
		);

		return result;
	}

	async deleteUser(id) {
		const result = await this._users.destroy({
			where: {id}
		});

		return result;
	}

	async getAllUsers() {
		const result = await this._users.findAll();

		return result;
	}

	async getUser(email, id) {
		let result;
		if (email) {
			result = await this._users.findOne({where: {email}});
		} else if (id) {
			result = await this._users.findOne({where: {id}});
		}

		return result && result.dataValues;
	}
}

const userService = new UsersService();

module.exports = UsersService;