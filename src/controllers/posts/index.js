const app = require('express');

const joi = require('joi');
const logger = require('../../common/logger')('PostsController');
const PostsService = require('../../services/posts.service').instance();
const postsValidator = require('./validation/index');
const ServiceError = require('../../common/errors/ServiceError');
const { authenticateToken } = require('../../middleware/auth');

const postsRouter = app.Router();

postsRouter.get('/', authenticateToken, async (req, res) => {
	try {
		const posts = await PostsService.getAllPosts();
		res.send(posts);
	} catch (error) {
		res.status(500).send('Internal Server Error');
		logger.error(error);
	}
});

postsRouter.get('/current', authenticateToken, async (req, res) => {
	try {
		const { userId } = req.user;

		try {
			joi.assert({ userId }, postsValidator.getPostValidation);
		} catch (validationError) {
			return res.status(400).send('Data is not valid');
		}

		const response = await PostsService.getUserPosts(userId);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

postsRouter.post('/', authenticateToken, async (req, res) => {
	try {
		const { title, body } = req.body;
		const { user } = req;

		const newPostData = {
			userId: user && user.userId,
			title,
			body
		};

		try {
			joi.assert(newPostData, postsValidator.addPostValidation);
		} catch (validationError) {
			return res.status(400).send('Data is not valid');
		}

		const response = await PostsService.createPost(newPostData);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

postsRouter.put('/:postId', authenticateToken, async (req, res) => {
	try {
		const { title, body } = req.body;
		const { postId } = req.params;
		const { user } = req;

		const newPostData = {
			postId,
			title,
			body
		};

		try {
			joi.assert(newPostData, postsValidator.updatePostValidation);
		} catch (validationError) {
			return res.status(400).send('Data is not valid');
		}

		const response = await PostsService.updatePost(newPostData, user);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

postsRouter.delete('/:postId', authenticateToken, async (req, res) => {
	try {
		const { postId } = req.params;
		const { user } = req;

		const response = await PostsService.deletePost(postId, user);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

module.exports = postsRouter;