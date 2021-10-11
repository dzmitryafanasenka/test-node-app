const app = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const AuthService = require('../../services/auth.service').instance();
const authValidator = require('./validation/index');
const logger = require('../../common/logger')('AuthController');
const UsersRepository = require('../../repositories/users.repository').instance();

const authRouter = app.Router();

authRouter.post('/signup', async (req, res) => {
	try {
		const { email, password } = req.body;

		try {
			joi.assert({ email, password }, authValidator.signUpValidation);
		} catch (validationError) {
			return res.status(400).send(validationError.details);
		}

		await AuthService.signup(res, { email, password });
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});

authRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		try {
			joi.assert({ email, password }, authValidator.loginValidation);
		} catch (loginError) {
			return res.status(400).send(loginError.details);
		}

		await AuthService.login(res, { email, password });
	} catch (error) {
		logger.error(error);
	}
});

authRouter.get('/verify/:id/:token', async (req, res) => {
	try {
		const user = await UsersRepository.getUser(null, req.params.id);

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

		await AuthService.verifyUser(res, user);
	} catch (error) {
		res.status(400).send('An error occurred');
		logger.error(error);
	}
});

module.exports = authRouter;