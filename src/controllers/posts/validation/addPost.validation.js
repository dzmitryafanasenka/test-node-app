const Joi = require('joi');

const addPostSchema = Joi.object({
	userId: Joi.string()
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

module.exports = addPostSchema;