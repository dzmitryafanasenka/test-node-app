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

		const response = await CommentsService.createComment(dataToCreate);

		if (!response.error){
			return res.send(response);
		} else {
			return res.status(response.error.status).send(response.error.message);
		}

	} catch (error) {
		res.status(500).send('Internal Server Error');
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

		const response = await CommentsService.updateComment({ dataToUpdate, commentId, userId });

		if (!response.error){
			return res.send(response);
		} else {
			return res.status(response.error.status).send(response.error.message);
		}

	} catch (error) {
		res.status(500).send('Internal Server Error');
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

	  const response = await CommentsService.deleteComment(commentId, userId);

		if (!response.error){
			return res.send(response);
		} else {
			return res.status(response.error.status).send(response.error.message);
		}

	} catch (error) {
		res.status(500).send('Internal Server Error');
		logger.error(error);
	}
});

module.exports = commentsRouter;