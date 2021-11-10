const app = require('express');
const joi = require('joi');

const auth = require('../../middleware/auth');
const CommentsService = require('../../services/comments.service').instance();
const commentsValidator = require('./validation');
const logger = require('../../common/logger')('CommentsController');
const ServiceError = require('../../common/errors/ServiceError');

const commentsRouter = app.Router();

commentsRouter.post('/:postId/comments', auth, async (req, res) => {
	try {
		const { postId } = req.params;
		const { userId } = req.user;
		const { body } = req.body;

		logger.debug(`User - [ ${userId} ] is creating a comment for post - [ ${postId} ].`);

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
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

commentsRouter.put('/:postId/comments/:commentId', auth, async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const { userId } = req.user;
		const { body } = req.body;

		logger.debug(`User - [ ${userId} ] is updating the comment - [ ${commentId} ] for post - [ ${postId} ].`);

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
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

commentsRouter.delete('/:postId/comments/:commentId', auth, async (req, res) => {
	try {
		const { postId, commentId } = req.params;
		const { userId } = req.user;

		logger.debug(`User - [ ${userId} ] is deleting the comment - [ ${commentId} ] for post - [ ${postId} ].`);

		const dataToDelete = { postId, commentId, userId };

		try {
			joi.assert(dataToDelete, commentsValidator.deleteCommentValidation);
		} catch (validationError) {
			return res.status(400).send({ message: 'Incorrect data' });
		}

		const response = await CommentsService.deleteComment(commentId, userId);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

module.exports = commentsRouter;