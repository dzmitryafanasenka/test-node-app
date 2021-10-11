const uuid = require('uuid').v4;

const db = require('../models');
const logger = require('../common/logger')('PostsService');

class PostsRepository {
	constructor() {
		this._posts = db.posts;
	}

	static instance() {
		return postsService;
	}

	async addPost(data) {
		const result = await this._posts.create({
			postId: uuid(),
			userId: data.userId,
			body: data.body,
			title: data.title,
			likes: 0,
			dislikes: 0
		});

		return result && result.dataValues;
	}

	async getAllPosts() {
		return await this._posts.findAll({
			include: [{
				model: db.comments
			}]
		});
	}

	async getUserPosts(userId) {
		return await this._posts.findAll({
			where: { userId },
			include: [{
				model: db.comments
			}]
		});
	}

	async getPostById(postId) {
		const result = await this._posts.findOne({
			where: { postId },
			include: [{
				model: db.comments
			}]
		});

		return result;
	}

	async updatePost(data) {
		await this._posts.update(
			{ body: data.body, title: data.title },
			{ where: { postId: data.postId } }
		);

		return await this.getPostById(data.postId);
	}

	async deletePost(postId) {
		return await this._posts.destroy({
			where: { postId }
		});
	}
}

const postsService = new PostsRepository();

module.exports = PostsRepository;