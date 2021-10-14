const logger = require('../common/logger')('PostsService');
const PostsRepository = require('../repositories/posts.repository').instance();
const ServiceError = require('../common/errors/ServiceError');


class PostsService {
	static instance() {
		return postsService;
	}

	async getAllPosts() {
		return await PostsRepository.getAllPosts();
	}

	async createPost(newPostData) {
		const createdPost = await PostsRepository.addPost(newPostData);
		if (!createdPost) {
			return new ServiceError(500, 'Can not create the post');
		}

		return createdPost;
	}

	async getUserPosts(userId) {
		const data = await PostsRepository.getUserPosts(userId);
		if (!data) {
			return new ServiceError(404, 'Can not get posts');
		}

		return data;
	}

	async updatePost(newPostData, user) {
		const post = await PostsRepository.getPostById(newPostData.postId);

		if (!post) {
			return new ServiceError(404, 'Post does not exist');
		}

		if (post.userId !== user.userId) {
			return new ServiceError(403, 'Forbidden');
		}

		const updatedPost = await PostsRepository.updatePost(newPostData);
		if (!updatedPost) {
			return new ServiceError(500, 'Cann not update the post');
		}

		return updatedPost;
	}

	async deletePost(postId, user) {
		const post = await PostsRepository.getPostById(postId);

		if (!post) {
			return new ServiceError(404, 'Post does not exist');
		}

		if (post.userId !== user.userId) {
			return new ServiceError(403, 'Forbidden');
		}

		const data = await PostsRepository.deletePost(postId);
		if (!data) {
			return new ServiceError(500, 'Can not delete the post');
		}

		return post;
	}
}

const postsService = new PostsService();

module.exports = PostsService;