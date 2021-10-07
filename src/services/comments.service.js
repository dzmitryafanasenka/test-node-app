const db = require('../models')

class CommentsService {
	static instance() {
		return commentsService
	}

	async getAllComments() {
		const result = await commentsImage.findAll();

		return result;
	}
}

const commentsService = new CommentsService();

module.exports = CommentsService