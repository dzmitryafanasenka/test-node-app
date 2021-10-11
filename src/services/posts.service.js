const logger = require('../common/logger')('PostsService');
const PostsRepository = require('../repositories/posts.repository').instance();

class PostsService {
	static instance() {
		return postsService;
	}

	async getAllPosts(res) {
		const data = await PostsRepository.getAllPosts();
		res.send(data);
	}

	async createPost(res, newPostData) {
		const createdPost = await PostsRepository.addPost(newPostData);
		if (!createdPost) {
			return res.status(500).send('Can not create the post');
		}

		res.send(createdPost);
	}

	async getUserPosts(res, userId) {
		const data = await PostsRepository.getUserPosts(userId);
		if (!data) {
			return res.status(404).send('Can not get posts');
		}

		res.send(data);
	}

	async updatePost(res, newPostData, user) {
		const post = await PostsRepository.getPostById(newPostData.postId);

		if (!post) {
			return res.status(404).send('Post does not exist');
		}

		if (post.userId !== user.userId) {
			return res.status(403).send('Forbidden');
		}

		const updatedPost = await PostsRepository.updatePost(newPostData);
		if (!updatedPost) {
			return res.status(500).send('Can not update the post');
		}

		res.send(updatedPost);
	}

	async deletePost(res, postId, user) {
		const post = await PostsRepository.getPostById(postId);

		if (!post) {
			return res.status(404).send('Post does not exist');
		}

		if (post.userId !== user.userId) {
			return res.status(403).send('Forbidden');
		}

		const data = await PostsRepository.deletePost(postId);
		if (!data) {
			return res.status(500).send('Can not delete the post');
		}

		res.send(post);
	}
}

const postsService = new PostsService();

module.exports = PostsService;