const Joi = require('joi');

const getPostSchema = Joi.object({
	userId: Joi.string()
		.min(3)
		.max(40)
		.required()
});

module.exports = getPostSchema;