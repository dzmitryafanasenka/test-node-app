const Joi = require('joi');

const signUpSchema =  Joi.object({
	email: Joi.string()
		.min(3)
		.email()
		.required(),

	password: Joi.string()
		.min(4)
		.max(12)
		.required()
});

module.exports = signUpSchema;