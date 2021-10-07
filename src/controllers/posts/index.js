const app = require('express');

const CommentsService = require('../../services/comments.service').instance();
const config = require('../../config');
const logger = require('../../common/logger')('PostsController');
const PostsService = require('../../services/posts.service').instance();
const { authenticateToken } = require('../../middleware/auth');

const postsRouter = app.Router();

postsRouter.get('/', authenticateToken, async (req, res) => {
	try {
		const id = req.query.id;
		let data;
		if (id) {
			if (+id !== +req.user.id) return res.status(403).send('Forbidden');
			data = await PostsService.getUserPosts(id);
		} else {
			data = await PostsService.getAllPosts();
		}
		res.send(data);
	} catch (error) {
		res.status(500).send('Can not get all posts');
		logger.error(error);
	}
});

postsRouter.post('/', authenticateToken, async (req, res) => {
	try {
		const { title, body } = req.body;
		const { user } = req;
		if (!(user && user.id && title && body)) return res.status(400).send('All post data is required');
		const data = await addPost({ id: user.id, title, body });
		if (!data) return res.status(500).send('Can not create the post');
		res.send(data);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

postsRouter.put('/', authenticateToken, async (req, res) => {
	try {
		const { title, body } = req.body;
		const { postId } = req.query;
		const { user } = req;

		const post = await getPostById(postId);
		if (!post) return res.status(404).send('Post does not exist');
		if (+post.id !== +user.id) return res.status(403).send('Forbidden');
		if (!(user && user.id && postId && title && body)) return res.status(400).send('All post data is required');
		const data = await updatePost({ postId, title, body });
		if (!data) return res.status(500).send('Can not update the post');

		res.send(data);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

postsRouter.delete('/', authenticateToken, async (req, res) => {
	try {
		const { postId } = req.query;
		const { user } = req;

		const post = await getPostById(postId);
		if (!post) return res.status(404).send('Post does not exist');
		if (+post.id !== +user.id) return res.status(403).send('Forbidden');
		const data = await deletePost(postId);
		if (!data) return res.status(500).send('Can not delete the post');

		res.send('Post has been deleted');
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

postsRouter.get('/comments', authenticateToken, async (req, res) => {
	try {
		console.log(CommentsService.getAllComments);
		const data = await CommentsService.getAllComments();
		if (!data) return res.status(500).send('An error occurred');

		res.send(data);
	} catch (error) {
		res.status(500).send('Unknown error');
		logger.error(error);
	}
});

module.exports = postsRouter;