const app = require('express');
const joi = require('joi');

const CommentsService = require('../../services/comments.service').instance();
const commentsValidator = require('./validation');
const logger = require('../../common/logger')('CommentsController');
const ServiceError = require('../../common/errors/ServiceError');
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

		const response = await CommentsService.createComment(dataToCreate);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
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

		const response = await CommentsService.updateComment({ dataToUpdate, commentId, userId });

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
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

		const response = await CommentsService.deleteComment(commentId, userId);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

module.exports = commentsRouter;