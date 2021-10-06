const logger = require('../../logger');
const { postImage } = require('../index');

async function addPost(data) {
	const result = await postImage.create({
		id: data.id,
		body: data.body,
		title: data.title,
		likes: 0,
		dislikes: 0
	});

	return result && result.dataValues;
}

async function getAllPosts() {
	const result = await postImage.findAll();

	return result;
}

async function getUserPosts(id) {
	const result = await postImage.findAll({ where: { id } });

	return result;
}

async function getPostById(postId) {
	const result = await postImage.findOne({ where: { postId } });

	return result;
}

async function updatePost(data) {
	await postImage.update(
		{ body: data.body, title: data.title },
		{ where: { postId: data.postId } }
	);
	const result = await getPostById(data.postId);

	return result;
}

async function deletePost(postId) {
	const result = await postImage.destroy({
		where: { postId }
	});

	return result;
}

module.exports = {
	addPost,
	getAllPosts,
	getUserPosts,
	getPostById,
	updatePost,
	deletePost
};