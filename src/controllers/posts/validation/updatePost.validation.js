const Joi = require('joi');

const updatePostSchema = Joi.object({
	postId: Joi.string()
		.min(3)
		.required(),

	title: Joi.string()
		.min(3)
		.max(40)
		.required(),

	body: Joi.string()
		.min(10)
		.max(200)
		.required()
});

module.exports = updatePostSchema;