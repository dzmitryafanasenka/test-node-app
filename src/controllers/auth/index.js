const app = require('express');
const joi = require('joi');

const AuthService = require('../../services/auth.service').instance();
const authValidator = require('./validation/index');
const logger = require('../../common/logger')('AuthController');
const ServiceError = require('../../common/errors/ServiceError');

const authRouter = app.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		const { email, password } = req.body;

		try {
			joi.assert({ email, password }, authValidator.signUpValidation);
		} catch (validationError) {
			return res.status(400).send(validationError.details);
		}

		const response = await AuthService.signup({ email, password });

		return res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

authRouter.post('/login', async (req, res, next) => {
	try {
		const { email, password } = req.body;

		try {
			joi.assert({ email, password }, authValidator.loginValidation);
		} catch (loginError) {
			return res.status(400).send(loginError.details);
		}

		const response = await AuthService.login({ email, password });

		res.send(response);

	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

authRouter.get('/verify/:id/:token', async (req, res) => {
	try {
		const user = req.user;

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

			return res.status(400).send('Invalid link');
		}

		const response = await AuthService.verifyUser(user);

		return res.send(response);
		//res.redirect(`${config.app.client.url}/login`)
	} catch (error) {
		if (error instanceof ServiceError) {
			return res.status(error.status).send(error.message);
		}
		logger.error(error);

		return res.status(500).send('Internal Server Error');
	}
});

module.exports = authRouter;