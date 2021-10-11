const uuid = require('uuid').v4;

const db = require('../models');
const logger = require('../common/logger')('CommentsRepository');

class CommentsRepository {
	constructor() {
		this._comments = db.comments;
	}

	static instance() {
		return commentsService;
	}

	async getComment(commentId) {
		return await this._comments.findOne({ where: { commentId } });
	}

	async createComment(data) {
		return await this._comments.create({
			commentId: uuid(),
			userId: data.userId,
			postId: data.postId,
			body: data.body
		});
	}

	async updateComment(data) {
		await this._comments.update(
			{ body: data.body },
			{ where: { commentId: data.commentId } }
		);

		return await this.getComment(data.commentId);
	}

	async deleteComment(commentId) {
		return await this._comments.destroy({ where: { commentId } });
	}
}

const commentsService = new CommentsRepository();

module.exports = CommentsRepository;