const {commentsImage} = require('../index')

async function getAllComments() {
	const result = await commentsImage.findAll();

	return result;
}

module.exports = {
	getAllComments
};