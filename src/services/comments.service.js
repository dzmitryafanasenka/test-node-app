const CommentsRepository = require('../repositories/comments.repository').instance();
const logger = require('../common/logger')('CommentsService');

class CommentsService {
	static instance() {
		return commentsService;
	}

	async createComment(res, dataToCreate) {
		const comment = await CommentsRepository.createComment(dataToCreate);
		if (!comment) {
			return res.status(500).send('Unable to create the comment');
		}

		res.send(comment);
	}

	async updateComment(res, data) {
		const { commentId, dataToUpdate, userId } = data;

		const comment = await CommentsRepository.getComment(commentId);
		if(!comment){
			res.status(404).send('Comment does not exist');
		}

		if (comment.userId !== userId) {
			return res.status(403).send('Forbidden');
		}

		const updatedComment = await CommentsRepository.updateComment(dataToUpdate);
		if(!updatedComment){
			return res.status(500).send('Can not update the comment');
		}

		res.send(updatedComment);
	}

	async deleteComment(res, commentId, userId) {
		const comment = await CommentsRepository.getComment(commentId);
		if(!comment){
			return res.status(404).send('Comment does not exist');
		}

		if (comment.userId !== userId) {
			return res.status(403).send('Forbidden');
		}

		const deletedComment = await CommentsRepository.deleteComment(commentId);
		if(!deletedComment){
			return res.status(500).send('Can not delete the comment');
		}

		res.send(comment);
	}
}

const commentsService = new CommentsService();

module.exports = CommentsService;