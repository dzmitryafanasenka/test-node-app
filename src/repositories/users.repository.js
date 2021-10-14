const uuid = require('uuid').v4;

const db = require('../models');
const logger = require('../common/logger')('UsersRepository');

class UsersRepository {
	constructor() {
		this._users = db.users;
	}

	static instance() {
		return userService;
	}

	async addUser(data) {
		const result = await this._users.create({
			userId: uuid(),
			email: data.email,
			password: data.password,
			activationCode: data.activationCode,
			activated: data.activated
		});

		return result && result.dataValues;
	}

	async activateUser(userId) {
		return await this._users.update(
			{ activated: true },
			{ where: { userId } }
		);
	}

	async updateUser(data) {
		await this._users.update(
			{
				phone: data.phone,
				nickname: data.nickname
			},
			{ where: { userId: data.userId } }
		);

		return await this.getUser(null, data.userId);
	}

	async deleteUser(userId) {
		return await this._users.destroy({
			where: { userId }
		});
	}

	async getAllUsers() {
		return await this._users.findAll({
			include: [{
				model: db.posts,
				include: [{ model: db.comments }]
			}]
		});
	}

	async getUser(email, userId) {
		let result;
		if (email) {
			result = await this._users.findOne({
				where: { email },
				include: [{
					model: db.posts,
					include: [{ model: db.comments }]
				}]
			});
		} else if (userId) {
			result = await this._users.findOne({
				where: { userId },
				include: [{
					model: db.posts,
					include: [{ model: db.comments }]
				}]
			});
		}

		return result && result.dataValues;
	}
}

const userService = new UsersRepository();

module.exports = UsersRepository;