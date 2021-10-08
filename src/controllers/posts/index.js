const app = require('express');

const CommentsService = require('../../services/comments.service').instance();
const config = require('../../config');
const joi = require('joi');
const logger = require('../../common/logger')('PostsController');
const PostsService = require('../../services/posts.service').instance();
const postsValidator = require('./validation/index');
const { authenticateToken } = require('../../middleware/auth');


const postsRouter = app.Router();

postsRouter.get('/', authenticateToken, async (req, res) => {
	try {
		const data = await PostsService.getAllPosts();
		res.send(data);
	} catch (error) {
		res.status(500).send('Can not get all posts');
		logger.error(error);
	}
});

postsRouter.get('/:userId', authenticateToken, async (req, res) => {
	try {
		const { userId } = req.params;
		if (userId !== req.user.userId) {
			return res.status(403).send('Forbidden');
		}
		const data = await PostsService.getUserPosts(userId);
		res.send(data);
	} catch (error) {
		res.status(500).send('Can not get all posts');
		logger.error(error);
	}
})
;

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
			return res.status(400).send('All post data is required');
		}

		const createdPost = await PostsService.addPost(newPostData);
		if (!createdPost) {
			return res.status(500).send('Can not create the post');
		}

		res.send(createdPost);
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

		const post = await PostsService.getPostById(postId);

		if (!post) {
			return res.status(404).send('Post does not exist');
		}

		if (post.userId !== user.userId) {
			return res.status(403).send('Forbidden');
		}

		try {
			joi.assert(newPostData, postsValidator.addPostValidation);
		} catch (validationError) {
			return res.status(400).send('All post data is required');
		}

		const updatedPost = await PostsService.updatePost(newPostData);
		if (!updatedPost) {
			return res.status(500).send('Can not update the post');
		}

		res.send(updatedPost);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

postsRouter.delete('/:postId', authenticateToken, async (req, res) => {
	try {
		const { postId } = req.params;
		const { user } = req;

		const post = await PostsService.getPostById(postId);

		if (!post) {
			return res.status(404).send('Post does not exist');
		}

		if (post.userId !== user.userId) {
			return res.status(403).send('Forbidden');
		}

		const data = await PostsService.deletePost(postId);
		if (!data) {
			return res.status(500).send('Can not delete the post');
		}

		res.send('Post has been deleted');
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

postsRouter.get('/comments', authenticateToken, async (req, res) => {
	try {
		const data = await CommentsService.getAllComments();
		if (!data) {
			return res.status(500).send('An error occurred');
		}

		res.send(data);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

module.exports = postsRouter;