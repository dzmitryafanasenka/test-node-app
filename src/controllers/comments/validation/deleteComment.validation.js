const Joi = require('joi');

const deleteCommentSchema = Joi.object({
	postId: Joi.string()
		.min(3)
		.max(40)
		.required(),

	userId: Joi.string()
		.min(3)
		.max(40)
		.required(),

	commentId: Joi.string()
		.max(100)
		.required()
});

module.exports = deleteCommentSchema;