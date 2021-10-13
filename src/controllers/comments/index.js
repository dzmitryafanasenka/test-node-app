const app = require('express');
const joi = require('joi');

const CommentsService = require('../../services/comments.service').instance();
const commentsValidator = require('./validation');
const logger = require('../../common/logger')('CommentsController');
const { authenticateToken } = require('../../middleware/auth');

const commentsRouter = app.Router();

commentsRouter.post('/:postId/comments', authenticateToken, async (req, res) => {
	try {
		const { postId } = req.params;
		const { userId } = req.user;
		const { body } = req.body;

		const dataToCreate = { postId, userId, body };

		try {
			joi.assert(dataToCreate, commentsValidator.createCommentValidation);
		} catch (validationError) {
			return res.status(400).send('Data is not valid');
		}

		try {
			const response = await CommentsService.createComment(dataToCreate);
			res.send(response);
		} catch (serviceError){
			res.status(serviceError.status).send(serviceError.message);
		}
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

commentsRouter.put('/:postId/comments/:commentId', authenticateToken, async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const { userId } = req.user;
		const { body } = req.body;

		const dataToUpdate = { postId, commentId, userId, body };

		try {
			joi.assert(dataToUpdate, commentsValidator.updateCommentValidation);
		} catch (validationError) {
			return res.status(400).send('Incorrect data');
		}

		try {
			const response = await CommentsService.updateComment({ dataToUpdate, commentId, userId });
			res.send(response);
		} catch (serviceError){
			res.status(serviceError.status).send(serviceError.message);
		}

	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

commentsRouter.delete('/:postId/comments/:commentId', authenticateToken, async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const { userId } = req.user;

		const dataToDelete = { postId, commentId, userId };

		try {
			joi.assert(dataToDelete, commentsValidator.deleteCommentValidation);
		} catch (validationError) {
			return res.status(400).send('Incorrect data');
		}

		try{
			const response = await CommentsService.deleteComment(commentId, userId);
			res.send(response);
		} catch (serviceError){
			res.status(serviceError.status).send(serviceError.message);
		}

	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

module.exports = commentsRouter;