const db = require('../models');
const logger = require('../common/logger')('UsersService');

class UsersService {
	constructor() {
		this._users = db.users;
	}
	
	static instance() {
		return usersService;
	} 
	
	async addUser(data) {
		logger.info('Creating a user');
		
		const result = await this._users.create({
			email: data.email,
			password: data.password,
			activationCode: data.activationCode,
			activated: data.activated
		});

		return result && result.dataValues;
	}

	async activateUser(id) {
		return await this._users.update(
			{ activated: true },
			{ where: { id } }
		);
	}

	async deleteUser(id) {
		return await this._users.destroy({
			where: { id }
		});
	}

	async getAllUsers() {
		logger.info('Retrieving users');

		return await this._users.findAll();
	}

	async getUser(email, id) {
		let result;
		if (email) {
			result = await this._users.findOne({ where: { email } });
		} else if (id) {
			result = await this._users.findOne({ where: { id } });
		}

		return result && result.dataValues;
	}
}

const usersService = new UsersService();

module.exports = UsersService;