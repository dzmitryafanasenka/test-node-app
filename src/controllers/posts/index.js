const app = require('express');
const joi = require('joi');
const passport = require('passport');

const auth = require('../../middleware/auth');
const logger = require('../../common/logger')('PostsController');
const PostsService = require('../../services/posts.service').instance();
const postsValidator = require('./validation/index');
const ServiceError = require('../../common/errors/ServiceError');

const postsRouter = app.Router();


postsRouter.get('/', auth, async (req, res) => {
	try {
		logger.debug('Getting posts.');
		
		const posts = await PostsService.getAllPosts();
		res.send(posts);
	} catch (error) {
		res.status(500).send({ message: 'Internal Server Error' });
		logger.error(error);
	}
});

postsRouter.get('/current', auth, async (req, res) => {
	try {
		const { userId } = req.user;

		logger.debug(`Getting posts for the user - [ ${userId} ].`);

		try {
			joi.assert({ userId }, postsValidator.getPostValidation);
		} catch (validationError) {
			return res.status(400).send({ message: 'Data is not valid' });
		}

		const response = await PostsService.getUserPosts(userId);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

postsRouter.post('/', auth, async (req, res) => {
	try {
		const { title, body } = req.body;
		const { user } = req;

		logger.debug(`User - [ ${user.userId} ] is creating a post.`);

		const newPostData = {
			userId: user && user.userId,
			title,
			body
		};

		try {
			joi.assert(newPostData, postsValidator.addPostValidation);
		} catch (validationError) {
			return res.status(400).send({ message: 'Data is not valid' });
		}
		const response = await PostsService.createPost(newPostData);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

postsRouter.put('/:postId', auth, async (req, res) => {
	try {
		const { title, body } = req.body;
		const { postId } = req.params;
		const { user } = req;

		logger.debug(`User - [ ${user.userId} ] is updating the post - [ ${postId} ].`);

		const newPostData = {
			postId,
			title,
			body
		};

		try {
			joi.assert(newPostData, postsValidator.updatePostValidation);
		} catch (validationError) {
			return res.status(400).send({ message: 'Data is not valid' });
		}

		const response = await PostsService.updatePost(newPostData, user);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

postsRouter.delete('/:postId', auth, async (req, res) => {
	try {
		const { postId } = req.params;
		const { user } = req;

		logger.debug(`User - [ ${user.userId} ] is deleting the post - [ ${postId} ].`);

		const response = await PostsService.deletePost(postId, user);

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

module.exports = postsRouter;