const logger = require('../../logger');
const {authenticateToken} = require('../../middleware/auth');
const {getAllPosts, getUserPosts, addPost, updatePost, getPostById, deletePost} = require('../../models/posts/index');
const {getAllComments} = require('../../models/comments/index')

function postsRoute(router) {
	router.get('/posts', authenticateToken, async (req, res) => {
		try {
			const id = req.query.id;
			let data;
			if (id) {
				if (+id !== +req.user.id) return res.status(403).send('Forbidden');
				data = await getUserPosts(id);
			} else {
				data = await getAllPosts();
			}
			res.send(data);
		} catch (error) {
			res.status(500).send('Can not get all posts');
			logger.error(error);
		}
	});

	router.post('/post', authenticateToken, async (req, res) => {
		try {
			const {title, body} = req.body;
			const {user} = req;
			if (!(user && user.id && title && body)) return res.status(400).send('All post data is required');
			const data = await addPost({id: user.id, title, body});
			if (!data) return res.status(500).send('Can not create the post');
			res.send(data);
		} catch (error) {
			res.status(500).send('Unknown error');
			logger.error(error);
		}
	});

	router.put('/post', authenticateToken, async (req, res) => {
		try {
			const {title, body} = req.body;
			const {postId} = req.query;
			const {user} = req;

			const post = await getPostById(postId);
			if (!post) return res.status(404).send('Post does not exist');
			if (+post.id !== +user.id) return res.status(403).send('Forbidden');
			if (!(user && user.id && postId && title && body)) return res.status(400).send('All post data is required');
			const data = await updatePost({postId, title, body});
			if (!data) return res.status(500).send('Can not update the post');

			res.send(data);
		} catch (error) {
			res.status(500).send('Unknown error');
			logger.error(error);
		}
	});

	router.delete('/post', authenticateToken, async (req, res) => {
		try {
			const {postId} = req.query;
			const {user} = req;

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

	router.get('/comments', authenticateToken, async (req, res) => {
		try {
			const data = await getAllComments();
			if (!data) return res.status(500).send('An error occured');

			res.send(data);
		} catch (error){
			res.status(500).send('Unknown error')
			logger.error(error)
		}
	})
}

module.exports = {
	postsRoute
};