const Joi = require('joi');

const verifyUserSchema = Joi.object({
	userId: Joi.string()
		.min(1)
		.required(),

	email: Joi.string()
		.min(3)
		.email()
		.required(),

	password: Joi.string()
		.min(4)
		.required(),

	activationCode: Joi.string()
		.required(),

	activated: Joi.boolean()
		.required()
});

module.exports = verifyUserSchema;