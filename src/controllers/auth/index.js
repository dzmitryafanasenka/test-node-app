const app = require('express');
const joi = require('joi');

const AuthService = require('../../services/auth.service').instance();
const authValidator = require('./validation/index');
const config = require('../../config');
const logger = require('../../common/logger')('AuthController');
const ServiceError = require('../../common/errors/ServiceError');
const UserService = require('../../services/users.service').instance();

const authRouter = app.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		const { email, password } = req.body;
		logger.debug(`Creating a user with email - [ ${email} ]`);

		try {
			joi.assert({ email, password }, authValidator.signUpValidation);
		} catch (validationError) {
			return res.status(400).send({ message: validationError.details });
		}

		const response = await AuthService.signup({ email, password });

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

authRouter.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		logger.debug(`User with email - [ ${email} ] is trying to login.`);

		try {
			joi.assert({ email, password }, authValidator.loginValidation);
		} catch (loginError) {
			return res.status(400).send(loginError.details);
		}

		const response = await AuthService.login({ email, password });

		res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

authRouter.get('/verify/:id/:token', async (req, res) => {
	try {
		const { id, token } = req.params;

		logger.debug(`Verifying a user - [ ${id} ] with token - [ ${token} ].`);

		const user = await UserService.getFullUserInfo(id);

		const userVerificationData = user && {
			userId: user.userId,
			email: user.email,
			activationCode: user.activationCode,
			activated: user.activated
		};

		try {
			joi.assert(userVerificationData, authValidator.verifyValidation);
		} catch (verificationError) {
			logger.error('Validation failed at the verification method', verificationError);

			return res.status(400).send({ message: 'Invalid link' });
		}

		await AuthService.verifyUser(user, token);

		return res.redirect(`${config.app.client.url}`);
	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.toJSON());
		}
		logger.error(error);

		return res.status(500).send({ message: 'Internal Server Error' });
	}
});

module.exports = authRouter;