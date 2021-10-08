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
			userId: data.userId,
			body: data.body,
			title: data.title,
			likes: 0,
			dislikes: 0
		});

		return result && result.dataValues;
	}

	async getAllPosts() {
		const result = await this._posts.findAll();

		return result;
	}

	async getUserPosts(id) {
		const result = await this._posts.findAll({ where: { id } });

		return result;
	}

	async getPostById(postId) {
		const result = await this._posts.findOne({ where: { postId } });

		return result;
	}

	async updatePost(data) {
		await this._posts.update(
			{ body: data.body, title: data.title },
			{ where: { postId: data.postId } }
		);
		const result = await getPostById(data.postId);

		return result;
	}

	async deletePost(postId) {
		const result = await this._posts.destroy({
			where: { postId }
		});

		return result;
	}
}

const postsService = new PostsService();

module.exports = PostsService;