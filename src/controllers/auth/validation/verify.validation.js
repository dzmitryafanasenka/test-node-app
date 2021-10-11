const Joi = require('joi');

const verifyUserSchema = Joi.object({
	userId: Joi.string()
		.min(1)
		.required(),

	email: Joi.string()
		.min(3)
		.email(),

	activationCode: Joi.string()
		.required(),

	activated: Joi.boolean()
});

module.exports = verifyUserSchema;