const Joi = require('joi');

const createCommentSchema = Joi.object({
	postId: Joi.string()
		.min(3)
		.max(40)
		.required(),

	userId: Joi.string()
		.min(3)
		.max(40)
		.required(),

	body: Joi.string()
		.max(100)
		.required()
});

module.exports = createCommentSchema;