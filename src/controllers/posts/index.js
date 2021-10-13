const app = require('express');

const joi = require('joi');
const logger = require('../../common/logger')('PostsController');
const PostsService = require('../../services/posts.service').instance();
const postsValidator = require('./validation/index');
const { authenticateToken } = require('../../middleware/auth');

const postsRouter = app.Router();

postsRouter.get('/', authenticateToken, async (req, res) => {
	try {
		await PostsService.getAllPosts(res);
	} catch (error) {
		res.status(500).send('Can not get all posts');
		logger.error(error);
	}
});

postsRouter.get('/current', authenticateToken, async (req, res) => {
	try {
		const { userId } = req.user;

		try {
			joi.assert({ userId }, postsValidator.getPostValidation);
		} catch (validationError){
			return res.status(400).send('Data is not valid');
		}

		await PostsService.getUserPosts(res, userId);
	} catch (error) {
		res.status(500).send('Can not get all posts');
		logger.error(error);
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

		await PostsService.createPost(res, newPostData);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
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

		await PostsService.updatePost(res, newPostData, user);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

postsRouter.delete('/:postId', authenticateToken, async (req, res) => {
	try {
		const { postId } = req.params;
		const { user } = req;

		await PostsService.deletePost(res, postId, user);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

module.exports = postsRouter;