const db = require('../models');
const logger = require('../common/logger')('CommentsService');

class CommentsService {
	constructor() {
		this._comments = db.comments;
	}

	static instance() {
		return commentsService;
	}

	async getAllComments() {
		return await this._comments.findAll(
			{
				include: [
					{ model: db.posts },
					{ model: db.user }
				]
			}
		);
	}
}

const commentsService = new CommentsService();

module.exports = CommentsService;