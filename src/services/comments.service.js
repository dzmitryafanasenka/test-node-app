const CommentsRepository = require('../repositories/comments.repository').instance();
const logger = require('../common/logger')('CommentsService');
const ServiceError = require('../common/errors/ServiceError');

class CommentsService {
	static instance() {
		return commentsService;
	}

	async createComment(dataToCreate) {
		const comment = await CommentsRepository.createComment(dataToCreate);
		if (!comment) {
			return new ServiceError(500, 'Unable to create the comment');
		}

		return comment;
	}

	async updateComment(data) {
		const { commentId, dataToUpdate, userId } = data;

		const comment = await CommentsRepository.getComment(commentId);
		if(!comment){
			return new ServiceError(404, 'Comment does not exist');
		}

		if (comment.userId !== userId) {
			return new ServiceError(403, 'Forbidden');
		}

		const updatedComment = await CommentsRepository.updateComment(dataToUpdate);
		if(!updatedComment){
			return new ServiceError(500, 'Can not update the comment');
		}

		return updatedComment;
	}

	async deleteComment(commentId, userId) {
		const comment = await CommentsRepository.getComment(commentId);
		if(!comment){
			return new ServiceError(404, 'Comment does not exist');
		}

		if (comment.userId !== userId) {
			return new ServiceError(403, 'Forbidden');
		}

		const deletedComment = await CommentsRepository.deleteComment(commentId);
		if(!deletedComment){
			return new ServiceError(500, 'Can not delete the comment');
		}

		return comment;
	}
}

const commentsService = new CommentsService();

module.exports = CommentsService;