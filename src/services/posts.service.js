const db = require('../models');
const logger = require('../common/logger')('PostsService');

class PostsService {
	constructor() {
		this._posts = db.posts;
	}

	static instance() {
		return postsService;
	}

	async addPost(data) {
		const result = await this._posts.create({
			id: data.id,
			body: data.body,
			title: data.title,
			likes: 0,
			dislikes: 0
		});

		return result && result.dataValues;
	}

	async getAllPosts() {
		logger.info('Retrieving all posts');

		return await this._posts.findAll();
	}

	async getUserPosts(id) {
		return await this._posts.findAll({ where: { id } });
	}

	async getPostById(postId) {
		return await this._posts.findOne({ where: { postId } });
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

const postsService = new PostsService();

module.exports = PostsService;